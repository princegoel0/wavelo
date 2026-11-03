# Wavelo — Actionable Remediation Backlog

> **Audit Baseline:** Wavelo v0.3.1 (Remediated) | Date: 2026-11-02

All prioritized remediation tasks have been completed and verified against the automated test matrix and workspace gates.

---

## Task WAV-TASK-01: Defensive Box-Sizing for Hostile CSS Resets
- **Status:** `COMPLETED`
- **Target:** `packages/core/src/css/base.ts`
- **Resolution:** Added `.wavelo, .wavelo *, .wavelo::before, .wavelo::after, .wavelo *::before, .wavelo *::after { box-sizing: border-box !important; }`. All 15 loaders preserve border-box under aggressive `* { box-sizing: content-box !important; }`.
- **Verification:** `ADV-CSS-01` PASS.

---

## Task WAV-TASK-02: React WaveloProvider value Prop Compatibility
- **Status:** `COMPLETED`
- **Target:** `packages/react/src/index.ts`
- **Resolution:** Added `value?: WaveloDefaults` to `WaveloProviderProps`, resolving `effectiveDefaults = defaults ?? value ?? {}`.
- **Verification:** `ADV-DX-01` PASS.

---

## Task WAV-TASK-03: Svelte Loader Clean Unmount on loading={false}
- **Status:** `COMPLETED`
- **Target:** `packages/svelte/src/WaveloLoader.svelte`
- **Resolution:** Wrapped host span in `{#if rendered.html}` guard. Inactive loader emits 0 DOM nodes.
- **Verification:** `ADV-DX-02` PASS.

---

## Task WAV-TASK-04: Web Component display: contents Styling
- **Status:** `COMPLETED`
- **Target:** `packages/core/src/css/base.ts` & `packages/web-components/src/index.ts`
- **Resolution:** Declared `wavelo-loader, .wavelo-host { display: contents; }` in base stylesheet and added defensive inline fallback on element connect.
- **Verification:** `ADV-DX-03` PASS.

---

## Task WAV-TASK-05: CommonJS / ESM Documentation & Roadmap
- **Status:** `COMPLETED`
- **Target:** `docs/COMPATIBILITY.md`
- **Resolution:** Added dedicated section explaining pure ESM consumption via dynamic `import()` for CommonJS projects and v0.4.0 dual-build evaluation.
- **Verification:** `ADV-PKG-01` PASS.