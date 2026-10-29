// What a stranger installs has to work on its own. Everything else in this
// repository checks the source tree; this one packs every workspace, installs the
// tarballs into a fresh project whose only other dependencies are the framework
// peers, then renders through them, reads the shipped CSS from them, and type checks
// a consumer against the declarations inside them.
//
//   npm run pack:verify
//
// It installs peers from the registry, so it is a release gate rather than part of
// `npm run check`.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loaderRegistry } from '../packages/core/dist/registry.js';

const root = resolve(import.meta.dirname, '..');
const tarballDirectory = resolve(root, 'release-tarballs');
const consumer = resolve(root, 'release-consumer');
const version = JSON.parse(readFileSync(resolve(root, 'packages/core/package.json'), 'utf8')).version;
const isWindows = process.platform === 'win32';
// Node refuses to spawn a `.cmd` shim directly, so npm runs through the shell the
// same way scripts/validate-release.mjs does.
const quote = (value) => (/[\s"]/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value);
const run = (args, cwd) =>
  execFileSync(
    isWindows ? process.env.ComSpec : 'npm',
    isWindows ? ['/d', '/s', '/c', ['npm', ...args.map(quote)].join(' ')] : args,
    { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  );

const node = (args, cwd) =>
  execFileSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

if (!existsSync(resolve(root, 'packages/core/dist/index.js'))) {
  console.error('packages/core/dist is missing; run npm run build first.');
  process.exit(1);
}

rmSync(tarballDirectory, { recursive: true, force: true });
mkdirSync(tarballDirectory, { recursive: true });
run(['pack', '--workspaces', '--pack-destination', tarballDirectory], root);
const tarballs = readdirSync(tarballDirectory).filter((name) => name.endsWith('.tgz'));
// `npm pack --workspaces` also packs the private docs app; only the seven below are
// published, and the release workflow's publish loop names exactly these.
const publishable = ['core', 'vanilla', 'web-components', 'react', 'vue', 'svelte', 'angular'];
const missing = publishable.filter((name) => !tarballs.includes(`wavelo-${name}-${version}.tgz`));
if (missing.length) {
  console.error(`These packages were not packed: ${missing.join(', ')}. Packed: ${tarballs.join(', ')}`);
  process.exit(1);
}

const tarball = (name) => `file:${resolve(tarballDirectory, `wavelo-${name}-${version}.tgz`).replace(/\\/g, '/')}`;
const coreSpec = tarball('core');

rmSync(consumer, { recursive: true, force: true });
mkdirSync(consumer, { recursive: true });
writeFileSync(
  resolve(consumer, 'package.json'),
  JSON.stringify(
    {
      name: 'wavelo-consumer',
      private: true,
      version: '1.0.0',
      type: 'module',
      // The adapters depend on @wavelo/core by version, and that version exists only
      // as a tarball here. The override keeps this an install of the artefacts under
      // test rather than a fetch of whatever happens to be published.
      overrides: { '@wavelo/core': coreSpec },
      dependencies: {
        '@wavelo/core': coreSpec,
        '@wavelo/vanilla': tarball('vanilla'),
        '@wavelo/web-components': tarball('web-components'),
        '@wavelo/react': tarball('react'),
        '@wavelo/vue': tarball('vue'),
        '@wavelo/svelte': tarball('svelte'),
        '@wavelo/angular': tarball('angular'),
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        vue: '^3.5.0',
        svelte: '^5.0.0',
        '@angular/core': '^22.0.0',
        rxjs: '^7.8.0',
        typescript: '^5.7.0',
        '@types/react': '^19.0.0'
      }
    },
    null,
    2
  )
);
run(['install', '--no-audit', '--no-fund', '--ignore-scripts'], consumer);

writeFileSync(
  resolve(consumer, 'check.mjs'),
  `import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { renderLoader, loaderRegistry, createWavelo, createRouteProgress } = await import('@wavelo/core');
assert.equal(loaderRegistry.length, ${loaderRegistry.length}, 'the installed registry does not hold the catalog the source built');

const ring = renderLoader({ type: 'ring', label: 'Loading' });
assert.match(ring.html, /class="wavelo wavelo--ring/);
assert.ok(ring.css.includes('.wavelo--ring{'), 'a runtime render lost its own rules');

const modular = await import('@wavelo/core/loaders/ring');
assert.equal(typeof modular.ring, 'function');
assert.ok(!modular.ring({}).css.includes('.wavelo--equalizer'), 'the modular entry carried another design');
assert.ok(modular.ring({}).css.includes('.wavelo--ring'), 'the modular entry lost its own rules');

const sheet = readFileSync(createRequire(import.meta.url).resolve('@wavelo/core/styles.css'), 'utf8');
assert.ok(sheet.includes('.wavelo--ring') && sheet.includes('.wavelo--skeleton-card'), 'the shipped sheet is missing designs');
assert.ok(sheet.includes('prefers-reduced-motion'), 'the shipped sheet lost the reduced-motion rules');

const vanilla = await import('@wavelo/vanilla');
assert.equal(typeof vanilla.mountLoader, 'function');
assert.match(vanilla.createWavelo({ type: 'ring' }).render().html, /wavelo--ring/, 'registered defaults did not reach the render');

// No DOM and no document: the helpers that would touch them must stay inert.
const bar = vanilla.createRouteProgress();
assert.equal(bar.element, null, 'the route bar created an element on a server');
assert.doesNotThrow(() => { bar.start(); bar.set(40); bar.done(); bar.destroy(); });
await import('@wavelo/web-components');

// The Svelte component ships as source, so the package must carry the file its
// exports map names.
const svelteEntry = fileURLToPath(import.meta.resolve('@wavelo/svelte'));
assert.ok(existsSync(svelteEntry.replace(/dist[\\\\/].*$/, \`src/WaveloLoader.svelte\`)), \`@wavelo/svelte was installed without its component: \${svelteEntry}\`);
`
);

writeFileSync(
  resolve(consumer, 'check.ts'),
  `import { renderLoader, type LoaderConfig, type WaveloTokens } from '@wavelo/core';
import { Loader as ReactLoader, WaveloProvider, loaderFor as reactLoaderFor, type WaveloProps } from '@wavelo/react';
import { Loader as VueLoader, provideWaveloDefaults, loaderFor as vueLoaderFor } from '@wavelo/vue';
import { renderSvelteLoader } from '@wavelo/svelte';
import { LoaderComponent, WAVELO_DEFAULTS } from '@wavelo/angular';
import { createWavelo, mountLoader, createRouteProgress } from '@wavelo/vanilla';
import type { FC } from 'react';

const style = { '--wavelo-radius': '2px', '--wavelo-ease': 'cubic-bezier(.2,0,.2,1)' } satisfies WaveloTokens;
const config: LoaderConfig = { type: 'ring', size: 32, loading: true, count: 3, inline: false, style };
const html: string = renderLoader(config).html;

const ButtonSpinner: FC<WaveloProps> = reactLoaderFor('ring', { size: 16 });
const VueButton = vueLoaderFor('ring', { size: 16 });
const wavelo = createWavelo({ type: 'ring' });
const bar = createRouteProgress({ color: '#6366f1' }, { trickle: 200, ceiling: 90, hold: 200 });

export const used = [html, ReactLoader, WaveloProvider, ButtonSpinner, VueLoader, VueButton, renderSvelteLoader, LoaderComponent, WAVELO_DEFAULTS, provideWaveloDefaults, mountLoader, wavelo, bar] as const;
`
);

const failures = [];
const check = (label, action) => {
  try {
    action();
    console.log(`  ok    ${label}`);
  } catch (error) {
    const detail = [error instanceof Error ? error.message : String(error), error?.stderr].filter(Boolean).join(' | ');
    failures.push(`${label}: ${detail.split('\n').slice(0, 8).join(' | ')}`);
    console.log(`  FAIL  ${label}`);
  }
};

check('the packed core, vanilla and web-components render and stay inert without a DOM', () => node(['check.mjs'], consumer));
check('a strict consumer type checks against the packed declarations', () =>
  node(
    ['node_modules/typescript/bin/tsc', '--noEmit', '--strict', '--target', 'ES2022', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'check.ts'],
    consumer
  )
);
check('every package ships a licence, a README and its declarations', () => {
  for (const name of ['core', 'vanilla', 'web-components', 'react', 'vue', 'svelte', 'angular']) {
    const directory = resolve(consumer, 'node_modules/@wavelo', name);
    for (const file of ['LICENSE', 'README.md', 'package.json', 'dist/index.js', 'dist/index.d.ts']) {
      if (!existsSync(resolve(directory, file))) throw new Error(`@wavelo/${name} is installed without ${file}`);
    }
  }
});

rmSync(consumer, { recursive: true, force: true });
rmSync(tarballDirectory, { recursive: true, force: true });

if (failures.length) {
  console.error(`Packed artefacts failed ${failures.length} check(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`Packed verification passed: 7 tarballs installed into a fresh project rendered, type checked and shipped their licence and README.`);
