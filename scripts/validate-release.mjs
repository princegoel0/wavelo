import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { platform } from 'node:os';

const packageFiles = [
  'packages/core/package.json',
  'packages/vanilla/package.json',
  'packages/web-components/package.json',
  'packages/react/package.json',
  'packages/vue/package.json',
  'packages/svelte/package.json',
  'packages/angular/package.json'
];

const packages = packageFiles.map((file) => JSON.parse(readFileSync(file, 'utf8')));
const npmCommand = platform() === 'win32' ? process.env.ComSpec : 'npm';
const versions = new Set(packages.map((pkg) => pkg.version));
if (versions.size !== 1) {
  throw new Error(`All publishable packages must share one version: ${[...versions].join(', ')}`);
}

const version = packages[0].version;
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`);
}

for (const pkg of packages) {
  for (const [dependency, dependencyVersion] of Object.entries(pkg.dependencies ?? {})) {
    if (dependency.startsWith('@wavelo/') && dependencyVersion !== version) {
      throw new Error(`${pkg.name} depends on ${dependency}@${dependencyVersion}, expected ${version}`);
    }
  }
}

const published = [];
for (const pkg of packages) {
  try {
    const npmArgs = platform() === 'win32'
      ? ['/d', '/s', '/c', `npm.cmd view ${pkg.name}@${version} version --json --ignore-scripts`]
      : ['view', `${pkg.name}@${version}`, 'version', '--json', '--ignore-scripts'];
    const result = execFileSync(npmCommand, npmArgs, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).trim();
    if (result) published.push(pkg.name);
  } catch (error) {
    const stderr = String(error?.stderr ?? '');
    if (!stderr.includes('E404') && !stderr.includes('404 Not Found')) {
      throw error;
    }
  }
}

if (published.length > 0) {
  throw new Error(`These exact package versions are already published: ${published.join(', ')}`);
}

console.log(`Release version ${version} is aligned across ${packages.length} packages and is not published.`);
