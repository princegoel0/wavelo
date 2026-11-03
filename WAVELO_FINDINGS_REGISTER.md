# Wavelo — Complete Findings Register

> **Audit Baseline:** Wavelo v0.3.1 (Remediated) | Date: 2026-11-02 | Total Documented Findings: 5 | Open Findings: 0 | Resolved: 5

### Findings Register Schema

| ID | Severity | Status | Component | Finding | Remediation Outcome | Effort | Confidence |
|---|---|---|---|---|---|---|---|
| <a id="wav-css-01"></a>**WAV-CSS-01** | **P1** | **RESOLVED in v0.3.1** | `css/base` | Hostile global box-sizing: content-box overrides Wavelo elements | Neutralized. .wavelo, .wavelo *, .wavelo::before, .wavelo::after { box-sizing: border-box !important; } ensures border-box computes cleanly under hostile resets. | S | High |
| <a id="wav-dx-01"></a>**WAV-DX-01** | **P2** | **RESOLVED in v0.3.1** | `@wavelo/react` | WaveloProvider ignores standard React value prop | Resolved. WaveloProviderProps now accepts value?: WaveloDefaults alongside defaults. | S | High |
| <a id="wav-dx-02"></a>**WAV-DX-02** | **P2** | **RESOLVED in v0.3.1** | `@wavelo/svelte` | Svelte Loader leaves empty host element when loading={false} | Resolved. WaveloLoader.svelte wraps host span in {#if rendered.html}. | S | High |
| <a id="wav-dx-03"></a>**WAV-DX-03** | **P2** | **RESOLVED in v0.3.1** | `@wavelo/web-components` | Web component host <wavelo-loader> lacks display: contents | Resolved. Base CSS declares wavelo-loader, .wavelo-host { display: contents; } and element sets display inline fallback. | S | High |
| <a id="wav-pkg-01"></a>**WAV-PKG-01** | **P3** | **RESOLVED (Documented + Roadmap in v0.3.1)** | `packaging` | CommonJS require() throws ERR_REQUIRE_ESM in legacy Node environments | Documented in docs/COMPATIBILITY.md with dynamic import() pattern and v0.4.0 roadmap. | M | High |

## Detailed Findings & Resolution Notes

### WAV-CSS-01: Hostile global box-sizing: content-box overrides Wavelo elements
- **Severity:** P1
- **Status:** RESOLVED in v0.3.1
- **Target Component:** `css/base`
- **Root Cause Analysis:** :where(.wavelo) specificity was 0
- **Remediation Action:** Added class-level !important defensive reset rule in base.ts
- **Verified Result:** Neutralized. .wavelo, .wavelo *, .wavelo::before, .wavelo::after { box-sizing: border-box !important; } ensures border-box computes cleanly under hostile resets.

### WAV-DX-01: WaveloProvider ignores standard React value prop
- **Severity:** P2
- **Status:** RESOLVED in v0.3.1
- **Target Component:** `@wavelo/react`
- **Root Cause Analysis:** Provider only extracted defaults prop
- **Remediation Action:** Resolve effectiveDefaults = defaults ?? value ?? {}
- **Verified Result:** Resolved. WaveloProviderProps now accepts value?: WaveloDefaults alongside defaults.

### WAV-DX-02: Svelte Loader leaves empty host element when loading={false}
- **Severity:** P2
- **Status:** RESOLVED in v0.3.1
- **Target Component:** `@wavelo/svelte`
- **Root Cause Analysis:** Unconditional host span rendering in Svelte template
- **Remediation Action:** Wrap host span in {#if rendered.html} guard
- **Verified Result:** Resolved. WaveloLoader.svelte wraps host span in {#if rendered.html}.

### WAV-DX-03: Web component host <wavelo-loader> lacks display: contents
- **Severity:** P2
- **Status:** RESOLVED in v0.3.1
- **Target Component:** `@wavelo/web-components`
- **Root Cause Analysis:** wavelo-loader selector omitted from base stylesheet
- **Remediation Action:** Added wavelo-loader to display: contents rule in base.ts and component
- **Verified Result:** Resolved. Base CSS declares wavelo-loader, .wavelo-host { display: contents; } and element sets display inline fallback.

### WAV-PKG-01: CommonJS require() throws ERR_REQUIRE_ESM in legacy Node environments
- **Severity:** P3
- **Status:** RESOLVED (Documented + Roadmap in v0.3.1)
- **Target Component:** `packaging`
- **Root Cause Analysis:** Pure ESM module distribution without CJS export
- **Remediation Action:** Document dynamic import() for CommonJS; roadmap dual CJS build for v0.4.0
- **Verified Result:** Documented in docs/COMPATIBILITY.md with dynamic import() pattern and v0.4.0 roadmap.
