# Release

Publishing is intentionally not automated from this repository checkout and must
not happen without explicit approval.

```powershell
npm install
npm run check
npm run build
npm run measure
npm pack --workspace @wavelo/core
```

Install the generated tarball in a clean temporary project, compile a documented
example, and inspect its contents before publishing. Confirm package names, access,
version, changelog, license, and provenance settings. Only then run the approved
release workflow or `npm publish` for the reviewed package.

Never publish an unreviewed pull request. Use semantic versioning and record the
exact validation environment in release notes.
