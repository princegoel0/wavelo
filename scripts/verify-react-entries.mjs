/**
 * Proves that the built `@wavelo/react` is usable from both halves of a React
 * Server Component tree.
 *
 * `Loader` injects its stylesheet in an effect, so the module that defines it has to
 * declare a client boundary; `renderReactLoader` is a plain function whose whole job
 * is running on the server. Before 0.5.0 both lived in one entry with no directive at
 * all, which meant the component threw when a Server Component rendered it and the
 * docs told every consumer to write a `'use client'` wrapper. The contract below is
 * what replaces that: the boundary is declared in the built artifact, the server
 * module reaches no module that declares one, and the entry still exports everything
 * it exported before.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const directory = resolve(root, 'packages/react');
/** Every name the published entry exported; removing one is a breaking change. */
const entrySurface = [
  'Loader',
  'Wavelo',
  'WaveloProvider',
  'loaderFor',
  'renderReactLoader',
  'useWaveloDefaults',
  'useWaveloProgress',
  'useWaveloState'
];
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

/**
 * A boundary directive is a string-statement at the top of a module, so comments —
 * including prose about the directive — must not be read as one.
 */
const hasDirective = (source) =>
  /^['"]use client['"];?\s/m.test(source.replace(/^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)+/, ''));

const read = async (file) => readFile(resolve(directory, file), 'utf8');

const manifest = JSON.parse(await read('package.json'));
const source = {
  'dist/index.js': await read('dist/index.js'),
  'dist/client.js': await read('dist/client.js'),
  'dist/hooks.js': await read('dist/hooks.js'),
  'dist/server.js': await read('dist/server.js')
};

for (const file of ['dist/client.js', 'dist/hooks.js']) {
  check(hasDirective(source[file]), `${file} declares no client boundary, so a Server Component importing it renders nothing usable`);
}
for (const file of ['dist/index.js', 'dist/server.js']) {
  check(!hasDirective(source[file]), `${file} declares a client boundary, so calling its server-side export from a Server Component throws`);
}

const relativeImports = (text) =>
  [...text.matchAll(/from\s+['"](\.[^'"]+)['"]/g)].map((match) => match[1]);

// server.js is the module a Server Component imports, so nothing it reaches inside
// the package may declare a boundary. Breadth-first, because a re-export of a
// re-export is the shape that hides this.
const reached = [];
for (const queue = [...relativeImports(source['dist/server.js'])]; queue.length;) {
  const specifier = queue.shift();
  const file = `dist/${specifier.split('/').pop()}`;
  reached.push(`${specifier}`);
  const text = await read(file).catch(() => undefined);
  if (text === undefined) {
    check(false, `dist/server.js imports ${specifier}, which is not built`);
    continue;
  }
  check(!hasDirective(text), `dist/server.js reaches ${file}, which declares a client boundary`);
  queue.push(...relativeImports(text).filter((seen) => !reached.includes(seen)));
}

for (const specifier of ['.', './client', './server']) {
  const target = manifest.exports?.[specifier];
  check(Boolean(target), `@wavelo/react must export "${specifier}" so a consumer can name the half it needs`);
  if (typeof target === 'object') {
    check(target.import?.startsWith('./dist/'), `@wavelo/react "${specifier}" must resolve inside dist`);
  }
}

const entry = await import(pathToFileURL(resolve(directory, 'dist/index.js')).href);
for (const name of entrySurface) {
  check(typeof entry[name] === 'function', `@wavelo/react no longer exports ${name} as a function`);
}
check(
  typeof globalThis.document === 'undefined',
  'this check must run without a DOM, which is the condition the server entry is for'
);
const { renderReactLoader } = await import(pathToFileURL(resolve(directory, 'dist/server.js')).href);
const markup = renderReactLoader({ type: 'ring', label: 'Loading' });
check(/class="wavelo wavelo--ring/.test(markup.html), 'the server entry rendered the wrong markup');
check(markup.css.includes('.wavelo--ring'), 'the server entry lost the stylesheet slice');

if (failures.length) {
  console.error(`React entry check failed:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(
  `React entries carry their boundaries: dist/client.js and dist/hooks.js declare one, dist/index.js and ` +
    `dist/server.js do not, ${entrySurface.length} entry exports intact, and the server entry renders ` +
    `${markup.html.length} B of markup with no DOM.`
);
