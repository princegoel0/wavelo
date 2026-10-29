// Package metadata is what a stranger reads before they trust the code: the
// manifest fields, the entry points they will actually import, and the licence.
// Every claim below is checked against the built files, so a package that points at
// a path it does not ship, or loses its licence file, fails the build rather than
// the install.
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const packageDirs = ['core', 'vanilla', 'web-components', 'react', 'vue', 'svelte', 'angular'];
/** Each adapter's peer, and the keyword a searcher types for that framework. */
const peers = {
  react: ['react', 'react'],
  vue: ['vue', 'vue'],
  svelte: ['svelte', 'svelte'],
  angular: ['@angular/core', 'angular']
};
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const dir of packageDirs) {
  const path = `packages/${dir}`;
  const manifest = JSON.parse(await readFile(resolve(root, path, 'package.json'), 'utf8'));
  const name = `@wavelo/${dir}`;
  check(manifest.name === name, `${path} declares the npm name ${manifest.name}, expected ${name}`);
  check(/^[\w ()/'@.,-]{15,160}$/.test(manifest.description ?? ''), `${name} needs a real description for the npm search page`);
  check(manifest.license === 'MIT', `${name} must declare license "MIT"`);
  check(manifest.type === 'module', `${name} must be type: module`);
  check(manifest.version === '0.1.0', `${name} version must match the release; npm run release:validate enforces alignment`);
  check(manifest.sideEffects === false || Array.isArray(manifest.sideEffects), `${name} must state sideEffects so a bundler may drop what is unused`);
  check(manifest.author === 'Prince Goel', `${name} has no author`);
  check(manifest.repository?.directory === path, `${name} repository must name its monorepo directory`);
  check(/^git\+https:\/\//.test(manifest.repository?.url ?? ''), `${name} repository.url must be a git+https URL`);
  check(Boolean(manifest.bugs?.url) && Boolean(manifest.homepage), `${name} needs bugs.url and homepage`);
  check(/^>=\d+\.\d+\.\d+$/.test(manifest.engines?.node ?? ''), `${name} needs an engines.node minimum version`);
  check((manifest.keywords ?? []).length >= 6, `${name} needs at least six keywords`);
  for (const keyword of ['loading', 'spinner', 'accessible']) {
    check(manifest.keywords.includes(keyword), `${name} is missing the "${keyword}" keyword`);
  }
  check(manifest.files?.includes('dist'), `${name} must ship dist`);
  for (const file of ['README.md', 'LICENSE']) {
    await access(resolve(root, path, file)).then(
      () => undefined,
      () => failures.push(`${name} does not contain ${file}`)
    );
  }
  check(!manifest.publishConfig || manifest.publishConfig.access === 'public', `${name} publishConfig.access must be public`);

  if (dir === 'core') {
    check(manifest.dependencies === undefined, 'core must have no runtime dependencies');
    check(manifest.peerDependencies === undefined, 'core must have no peer dependencies');
  } else {
    check(manifest.dependencies?.['@wavelo/core'] === '0.1.0', `${name} must depend on @wavelo/core@0.1.0`);
    const [peer] = peers[dir] ?? [];
    if (peer) {
      check(Boolean(manifest.peerDependencies?.[peer]), `${name} must declare ${peer} as a peer dependency`);
      check(manifest.keywords.includes(peers[dir][1]), `${name} is missing the "${peers[dir][1]}" keyword`);
    }
  }

  // Every target the exports map names must exist in the build output, and the
  // TypeScript entry points must carry declarations.
  for (const [specifier, target] of Object.entries(manifest.exports ?? {})) {
    const entries = typeof target === 'string' ? [target] : Object.values(target);
    for (const entry of entries) {
      if (entry.includes('*')) continue;
      const file = resolve(root, path, entry);
      await access(file).then(() => undefined, () => failures.push(`${name} exports "${specifier}" at ${entry}, which is not built`));
      if (entry.endsWith('.js')) {
        await access(file.replace(/\.js$/, '.d.ts')).then(() => undefined, () => failures.push(`${name} exports "${specifier}" without a .d.ts beside ${entry}`));
      }
    }
  }
}

if (failures.length) {
  console.error(`Package metadata check failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`Package metadata is complete for ${packageDirs.length} packages: names, licences, peers, engines, keywords and every built export path.`);
