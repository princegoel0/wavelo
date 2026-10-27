# Wavelo

Wavelo is a dependency-light, framework-independent loading and motion library.
The repository contains a typed core, modular catalog, DOM/Web Component support,
framework configuration bridges, and a registry-driven documentation gallery.

## Development

```powershell
npm install
npm run check
npm run build
npm run docs:build
npm run measure
```

The package is not published by these commands. See [docs/RELEASE.md](docs/RELEASE.md)
before any release action.

## Core usage

```ts
import { renderLoader } from '@wavelo/core';

const loading = renderLoader({
  type: 'orbiting-dots',
  label: 'Loading data',
  color: '#6366f1',
  reducedMotion: 'auto'
});
```

See [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the current integration
support boundary, [docs/FRAMEWORKS.md](docs/FRAMEWORKS.md) for verified usage
examples, and [PRD.md](PRD.md) for the complete product requirements.
