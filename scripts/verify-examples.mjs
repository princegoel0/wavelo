import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

/**
 * The examples are documentation that has to keep compiling.
 *
 * A snippet in a README rots quietly; a file in `examples/` rots noisily if something
 * checks it. This script is that check, using only the toolchain the repository already
 * installs: it compiles every Svelte and Vue source, compiles the Angular application with
 * the Angular compiler, type checks the React one with `tsc`, and proves that every
 * `@wavelo/*` import in every example — including the Next.js and Nuxt sources, whose
 * frameworks are not installed here — names a binding the built package actually exports,
 * through an entry point its manifest declares, from a project that depends on it.
 */
const root = resolve(import.meta.dirname, '..');
const examples = resolve(root, 'examples');
const ignoredExamplePaths = /(^|[\\/])(node_modules|dist|\.next|\.nuxt|\.svelte-kit|\.output|\.angular)([\\/]|$)/;
const { version } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const failures = [];
const compiled = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const projectOf = (file) => file.slice(examples.length + 1).split(/[\\/]/)[0];
const run = (label, args) => {
  try {
    execFileSync(process.execPath, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    compiled.push(label);
  } catch (error) {
    const detail = [error?.stdout, error?.stderr].filter(Boolean).join('\n').trim();
    failures.push(`${label}:\n${detail.split('\n').slice(0, 10).join('\n')}`);
  }
};
const npmCli = process.env.npm_execpath?.endsWith('.js')
  ? process.env.npm_execpath
  : resolve(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
if (!existsSync(npmCli)) throw new Error('Unable to locate npm-cli.js; run this verifier through npm.');
const runNpm = (args, cwd) => execFileSync(
  process.execPath,
  [npmCli, ...args],
  {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 15 * 60 * 1000,
    maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, CI: '1', NEXT_TELEMETRY_DISABLED: '1', NG_CLI_ANALYTICS: 'false' }
  }
);

const manifests = new Map();
const manifestFor = async (name) => {
  if (!manifests.has(name)) {
    manifests.set(name, JSON.parse(await readFile(join(root, 'packages', name, 'package.json'), 'utf8')));
  }
  return manifests.get(name);
};

/** The target an exports map declares for a subpath, or undefined for an entry it omits. */
const exportTarget = (manifest, specifier) => {
  const table = manifest.exports ?? {};
  if (table[specifier]) return table[specifier];
  for (const [pattern, target] of Object.entries(table)) {
    if (!pattern.includes('*')) continue;
    const [prefix, suffix = ''] = pattern.split('*');
    if (!specifier.startsWith(prefix) || !specifier.endsWith(suffix)) continue;
    const wildcard = specifier.slice(prefix.length, specifier.length - suffix.length);
    return typeof target === 'string' ? target.replace('*', wildcard) : Object.fromEntries(Object.entries(target).map(([key, value]) => [key, value.replace('*', wildcard)]));
  }
  return undefined;
};

const declarationOf = (target) => (typeof target === 'string' ? target : target?.types);

/** Every name a declaration file exports, following the re-exports it chains. */
const collectExports = async (file, seen = new Set()) => {
  const absolute = resolve(file);
  if (seen.has(absolute) || !existsSync(absolute)) return new Set();
  seen.add(absolute);
  const text = await readFile(absolute, 'utf8');
  const names = new Set();
  const addList = (list) => {
    for (const entry of list.split(',')) {
      const token = entry.trim();
      if (token) names.add(token.replace(/^type\s+/, '').split(/\s+as\s+/).pop().trim());
    }
  };
  const follow = async (from) => {
    if (!from.startsWith('.')) return;
    // Not `names.add(...set)`: Set.prototype.add takes one argument, so every name after
    // the first re-exported one would be dropped.
    for (const name of await collectExports(join(dirname(absolute), from.replace(/\.js$/, '.d.ts')), seen)) names.add(name);
  };
  for (const match of text.matchAll(/export declare (?:abstract )?(?:const|function|class|let|var|interface|type|enum) (\w+)/g)) names.add(match[1]);
  for (const match of text.matchAll(/export(?: type)? \{([^}]*)\}(?: from '([^']+)')?/g)) {
    addList(match[1]);
    if (match[2]) await follow(match[2]);
  }
  for (const match of text.matchAll(/export \* from '([^']+)'/g)) await follow(match[1]);
  return names;
};

const sources = (await readdir(examples, { recursive: true }))
  .filter((path) => !ignoredExamplePaths.test(path) && /\.(ts|tsx|svelte|vue)$/.test(path) && !/(\.config\.|\.d\.)/.test(path))
  .map((path) => join(examples, path));

for (const file of sources) {
  const text = await readFile(file, 'utf8');
  const project = projectOf(file);
  const dependencies = (JSON.parse(await readFile(join(examples, project, 'package.json'), 'utf8').catch(() => '{}'))).dependencies ?? {};
  const named = [...text.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'(@wavelo\/[^']+)'/g)];
  const defaulted = [...text.matchAll(/import\s+(\w+)\s+from\s+'(@wavelo\/[^']+)'/g)];
  for (const [bindings, specifier, kind] of [...named.map((match) => [match[1], match[2], 'named']), ...defaulted.map((match) => ['', match[2], 'default'])]) {
    const name = /@wavelo\/([\w-]+)/.exec(specifier)[1];
    const target = exportTarget(await manifestFor(name), specifier.replace(`@wavelo/${name}`, '.'));
    if (!target) {
      failures.push(`examples/${project} imports '${specifier}', which @wavelo/${name}'s exports map does not declare`);
      continue;
    }
    check(dependencies[`@wavelo/${name}`] === version, `examples/${project} depends on @wavelo/${name}@${dependencies[`@wavelo/${name}`] ?? 'missing'}, expected ${version}`);
    if (kind === 'default') continue;
    const declaration = declarationOf(target);
    if (!declaration?.endsWith('.d.ts')) continue;
    const exported = await collectExports(join(root, 'packages', name, declaration.replace(/^\.\//, '')));
    for (const entry of bindings.split(',')) {
      const token = entry.trim();
      if (!token) continue;
      const imported = token.replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
      check(exported.has(imported), `examples/${project} imports ${imported} from '${specifier}', which @wavelo/${name} does not export`);
    }
  }
}

const { compile } = await import('svelte/compiler');
for (const file of sources.filter((path) => path.endsWith('.svelte'))) {
  const source = await readFile(file, 'utf8');
  for (const generate of ['client', 'server']) {
    try {
      compile(source, { generate, filename: file });
    } catch (error) {
      failures.push(`examples/${file.slice(examples.length + 1)} does not compile for the ${generate} build: ${error.message}`);
    }
  }
}

const sfc = await import('@vue/compiler-sfc');
for (const file of sources.filter((path) => path.endsWith('.vue'))) {
  const source = await readFile(file, 'utf8');
  const { descriptor, errors } = sfc.parse(source, { filename: file });
  if (errors.length) failures.push(`examples/${file.slice(examples.length + 1)} is not a valid single-file component: ${errors[0].message}`);
  else {
    const script = descriptor.scriptSetup ? sfc.compileScript(descriptor, { id: file }) : undefined;
    if (descriptor.template) {
      const template = sfc.compileTemplate({
        source: descriptor.template.content,
        filename: file,
        id: file,
        compilerOptions: { bindingMetadata: script?.bindings }
      });
      if (template.errors.length) failures.push(`examples/${file.slice(examples.length + 1)} has an invalid template: ${template.errors[0]}`);
    }
  }
}

// ngc resolves a `templateUrl` relative to the file that declares it, which needs the
// build config this example deliberately does not carry. Its components use inline
// templates; if that changes, say so here instead of letting the check ignore it.
const angularSource = (await readdir(join(examples, 'angular-standalone/src'), { recursive: true })).join('\n');
check(!/templateUrl/.test(angularSource), 'the Angular example uses a templateUrl, which this check cannot resolve');

run('the Angular example compiles with the Angular compiler', ['node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js', '-p', 'examples/angular-standalone/tsconfig.json']);
run('the React example type checks', ['node_modules/typescript/bin/tsc', '-p', 'examples/react-vite/tsconfig.json']);

if (failures.length) {
  console.error(`Example check failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const projects = new Set(sources.map(projectOf));
console.log(
  `Examples verified: ${sources.length} sources in ${projects.size} projects, every @wavelo import resolved against the built ` +
    `declarations and declared as a dependency, ${sources.filter((file) => file.endsWith('.svelte')).length} Svelte components ` +
    `compiled for client and server, ${sources.filter((file) => file.endsWith('.vue')).length} single-file components compiled with their templates, ` +
    `and the Angular compiler and React type check ${compiled.length === 2 ? 'both' : ''} passed.`
);

if (process.argv.includes('--build')) {
  if (!existsSync(resolve(root, 'packages/core/dist/index.js'))) {
    throw new Error('packages/core/dist is missing; run npm run build before verifying production example builds.');
  }
  const workspace = mkdtempSync(resolve(tmpdir(), 'wavelo-example-builds-'));
  const tarballDirectory = resolve(workspace, 'tarballs');
  mkdirSync(tarballDirectory, { recursive: true });
  try {
    runNpm(['pack', '--workspaces', '--pack-destination', tarballDirectory], root);
    const tarball = (name) => {
      const file = resolve(tarballDirectory, `wavelo-${name}-${version}.tgz`);
      if (!existsSync(file)) throw new Error(`Missing packed @wavelo/${name}@${version} tarball.`);
      return `file:${file.replace(/\\/g, '/')}`;
    };
    for (const project of projects) {
      const directory = resolve(workspace, project);
      cpSync(resolve(examples, project), directory, {
        recursive: true,
        filter: (source) => !ignoredExamplePaths.test(source)
      });
      const manifestPath = resolve(directory, 'package.json');
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
      for (const dependency of Object.keys(manifest.dependencies ?? {})) {
        if (dependency.startsWith('@wavelo/')) manifest.dependencies[dependency] = tarball(dependency.slice('@wavelo/'.length));
      }
      manifest.overrides = { ...manifest.overrides, '@wavelo/core': tarball('core') };
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      try {
        runNpm(['install', '--no-audit', '--no-fund'], directory);
        runNpm(['run', 'build'], directory);
        console.log(`  ok    ${project} production build`);
      } catch (error) {
        const detail = [error?.stdout, error?.stderr].filter(Boolean).join('\n').trim();
        throw new Error(`${project} production build failed:\n${detail.split('\n').slice(-40).join('\n')}`);
      }
    }
    console.log(`Production example builds passed: ${[...projects].join(', ')}.`);
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}
