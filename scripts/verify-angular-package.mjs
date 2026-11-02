/**
 * Proves that the built `@wavelo/angular` is something an Angular application can use.
 *
 * A component compiled by `tsc` alone carries no Ivy definition, so an AOT build rejects it
 * with NG2012 and only a runtime `@angular/compiler` accepts it — which is why every unit test
 * here passed while the published package was unusable in an application. The three checks
 * below are the contract: the artifact is library-compiled, it does not promise an application
 * older than its own `minVersion`, and a consumer component written the way the docs write it
 * compiles with the Angular compiler.
 */
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const NG_DECLARE = 'ɵɵngDeclareComponent';
const failures = [];

const manifest = JSON.parse(await readFile(resolve(root, 'packages/angular/package.json'), 'utf8'));
const dist = await readFile(resolve(root, 'packages/angular/dist/index.js'), 'utf8');

if (!dist.includes(NG_DECLARE)) {
  failures.push(
    'packages/angular/dist/index.js has no partial component declaration, so an AOT `ng build` ' +
      'fails with NG2012. Build it with ngc and compilationMode "partial".'
  );
}

/** The oldest Angular application that can link this artifact, as the artifact itself states. */
const minVersions = [...dist.matchAll(/minVersion: "(\d+\.\d+\.\d+)"/g)].map((match) => match[1]);
const floor = minVersions.sort(compare)[minVersions.length - 1];

const declared = />=\s*(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(manifest.peerDependencies?.['@angular/core'] ?? '');
if (!declared) {
  failures.push('@wavelo/angular must declare an "@angular/core" peer with a ">=major.minor.patch" floor.');
} else if (floor) {
  const promised = `${declared[1]}.${declared[2] ?? 0}.${declared[3] ?? 0}`;
  if (compare(promised, floor) < 0) {
    failures.push(
      `@wavelo/angular promises Angular ${promised} and up, but the built artifact needs ${floor}: ` +
        'an application older than that cannot link its component declarations.'
    );
  }
}

try {
  // Run the compiler through node: the `.bin/ngc` shim is a POSIX shell script, so a
  // child process started with execFileSync cannot launch it on Windows.
  const ngc = resolve(root, 'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js');
  execFileSync(process.execPath, [ngc, '-p', 'tests/fixtures/tsconfig.aot.json'], {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8'
  });
} catch (error) {
  failures.push(`an application cannot compile against the built package:\n${((error.stdout ?? '') + (error.stderr ?? '')).trim()}`);
}

function compare(a, b) {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

if (failures.length) {
  console.error(`Angular package check failed:\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(
  `Angular package is library-compiled: ${minVersions.length} partial declarations, linking from ${floor}, ` +
    `peer floor ${manifest.peerDependencies['@angular/core']}, consumer fixture compiles.`
);
