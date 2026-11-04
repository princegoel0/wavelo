import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
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
  .filter((path) => /\.(ts|tsx|svelte|vue)$/.test(path) && !/(\.config\.|\.d\.)/.test(path))
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
    check(dependencies[`@wavelo/${name}`] !== undefined, `examples/${project} imports '${specifier}' but does not depend on @wavelo/${name}`);
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
  else if (descriptor.scriptSetup) sfc.compileScript(descriptor, { id: file });
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
    `compiled for client and server, ${sources.filter((file) => file.endsWith('.vue')).length} single-file components compiled, ` +
    `and the Angular and React applications ${compiled.length === 2 ? 'both' : ''} built.`
);
