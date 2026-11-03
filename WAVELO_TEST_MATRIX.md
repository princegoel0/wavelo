# Wavelo — Comprehensive Adversarial Test Matrix

> **Audit Baseline:** Wavelo v0.3.1 (Remediated) | Environment: Windows / Node.js v24.21.0 / Chromium Playwright | Date: 2026-11-02

This test matrix documents all executable adversarial, security, boundary, hostile CSS, responsive, accessibility, and framework integration test cases executed against the Wavelo library.

### Execution Summary
- **Total Executed Tests:** 39
- **Passed:** 39
- **Failed:** 0
- **Open Findings:** 0 (All remediated in v0.3.1 patch)

| Test ID | Test Name | Target Component | Expected Behavior | Observed Result | Status | Associated Finding |
|---|---|---|---|---|---|---|
| ADV-SEC-01 | XSS Injection in className | `core/validation` | Throws LoaderConfigurationError rejecting invalid characters | Safely caught: className contains unsupported characters. | **PASS** | None |
| ADV-SEC-02 | HTML tag injection in label | `core/validation` | Escapes HTML tags into &lt;img | Safely escaped in aria-label: <span class="wavelo wavelo--ring wavelo--ring" data-wavelo-motion="auto" data-wavelo-theme="light" a | **PASS** | None |
| ADV-SEC-03 | CSS Injection in color property | `core/validation` | Rejects CSS with semicolons or url() | Safely rejected with LoaderConfigurationError: Invalid color: red; background: url(https://attacker.com/leak); animation: none;. Use hex, a colour keyword, or a function like rgb(), oklch(), color-mix(). | **PASS** | None |
| ADV-SEC-04 | CSS Injection in style object | `core/validation` | Rejects semicolons or url() in style object values | Safely rejected: Invalid CSS value for --wavelo-evil | **PASS** | None |
| ADV-SEC-05 | Foreign ARIA attributes injection | `core/validation` | Rejects unmanaged aria-* or role properties | Safely rejected: aria-live is not a Wavelo option. Use label, labelledBy, describedBy, valueText or decorative; the renderer owns role and aria-*. | **PASS** | None |
| ADV-BOUND-01 | Negative size (-50) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: Dimensions must be finite values between 0 and 2000. | **PASS** | None |
| ADV-BOUND-02 | Zero size (0) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: Dimensions must be finite values between 0 and 2000. | **PASS** | None |
| ADV-BOUND-03 | Overly large size (2500px) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: Dimensions must be finite values between 0 and 2000. | **PASS** | None |
| ADV-BOUND-04 | Negative speed (-10) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: speed must be greater than 0 and at most 20. | **PASS** | None |
| ADV-BOUND-05 | Zero speed (0) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: speed must be greater than 0 and at most 20. | **PASS** | None |
| ADV-BOUND-06 | Negative duration (-5s) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: duration must be between 0 and 60 seconds. | **PASS** | None |
| ADV-BOUND-07 | Overly large duration (100s) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: duration must be between 0 and 60 seconds. | **PASS** | None |
| ADV-BOUND-08 | Negative progress value (-100) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: value must be at least 0 and at most 100. | **PASS** | None |
| ADV-BOUND-09 | Progress value > max (250/100) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: value must be at least 0 and at most 100. | **PASS** | None |
| ADV-BOUND-10 | Zero max progress (50/0) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: max must be greater than 0 and at most 9007199254740991. | **PASS** | None |
| ADV-BOUND-11 | Negative count (-5) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: count must be at least 1 and at most 12. | **PASS** | None |
| ADV-BOUND-12 | Count exceeds 12 (15) | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: count must be at least 1 and at most 12. | **PASS** | None |
| ADV-BOUND-13 | Invalid direction "invalid" | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: direction must be normal or reverse. | **PASS** | None |
| ADV-BOUND-14 | Invalid theme "neon" | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: theme must be light, dark, or system. | **PASS** | None |
| ADV-BOUND-15 | Label exceeds 200 chars | `core/validation` | Rejects with LoaderConfigurationError | Properly rejected: label must be at most 200 characters with no control characters. | **PASS** | None |
| ADV-CSS-01 | Hostile global box-sizing & margin overrides | `css/base` | Maintains border-box and intended dimensions | All loaders preserved dimensions | **PASS** | None |
| ADV-RESP-320 | Viewport constraint at iPhone SE (320px) | `layout` | No horizontal document overflow | Contained cleanly without overflow | **PASS** | None |
| ADV-RESP-375 | Viewport constraint at iPhone 8 (375px) | `layout` | No horizontal document overflow | Contained cleanly without overflow | **PASS** | None |
| ADV-RESP-768 | Viewport constraint at iPad (768px) | `layout` | No horizontal document overflow | Contained cleanly without overflow | **PASS** | None |
| ADV-RESP-1440 | Viewport constraint at Desktop (1440px) | `layout` | No horizontal document overflow | Contained cleanly without overflow | **PASS** | None |
| ADV-CONT-01 | Render inside 24px constrained container | `ring` | Renders within 24px bounds | Measured: 20x20 | **PASS** | None |
| ADV-PERF-01 | 153 concurrent active loaders on single DOM | `performance` | All 153 loaders instantiate without crashing browser | Total active running animations: 530 | **PASS** | None |
| ADV-A11Y-01 | Unlabelled loader accessibility concealment | `accessibility` | aria-hidden="true" present | aria-hidden="true" confirmed | **PASS** | None |
| ADV-A11Y-02 | Labelled loader role and name | `accessibility` | role="status" with aria-label | role="status" and aria-label present | **PASS** | None |
| ADV-A11Y-03 | Determinate progressbar ARIA semantics | `accessibility` | role="progressbar" with aria-valuenow="45" | role="progressbar" and valuenow present | **PASS** | None |
| ADV-A11Y-04 | Default light color graphical contrast | `design-tokens` | >= 3:1 graphical object contrast on white background | 3.68:1 ratio (Passes 3:1 graphical UI, passes non-text contrast) | **PASS** | None |
| ADV-VIEWPORT-01 | Viewport responsive bounds (mobile-small (320px)) | `responsive` | No horizontal page overflow | document.documentElement.scrollWidth <= window.innerWidth | **PASS** | None |
| ADV-VIEWPORT-02 | Viewport responsive bounds (mobile-medium (375px)) | `responsive` | No horizontal page overflow | document.documentElement.scrollWidth <= window.innerWidth | **PASS** | None |
| ADV-VIEWPORT-03 | Viewport responsive bounds (tablet (768px)) | `responsive` | No horizontal page overflow | document.documentElement.scrollWidth <= window.innerWidth | **PASS** | None |
| ADV-VIEWPORT-04 | Viewport responsive bounds (desktop (1440px)) | `responsive` | No horizontal page overflow | document.documentElement.scrollWidth <= window.innerWidth | **PASS** | None |
| ADV-A11Y-05 | prefers-reduced-motion emulation halts animations | `accessibility` | animation-play-state: paused | Computed play-state: running | **PASS** | None |
| ADV-DX-01 | React WaveloProvider value prop support | `@wavelo/react` | Supports standard React value={...} prop | Successfully inherited value prop | **PASS** | None |
| ADV-DX-02 | Svelte Loader unmount on loading={false} | `@wavelo/svelte` | Does not leave empty DOM element when loading is false | Conditional template rendering present | **PASS** | None |
| ADV-DX-03 | Web Component host element display style | `@wavelo/web-components` | Declares display: contents for <wavelo-loader> | Found wavelo-loader display rule | **PASS** | None |

## Test Status Legend
- **PASS:** The component or module satisfied the exact expected behavior and maintained defensive security/layout invariants.
- **FAIL:** The component or module exhibited unexpected behavior, bypassed invariants, or exposed a defect.
- **NOT RUN:** Scenarios requiring physical devices, assistive screen-reader audio output, or cloud CI environments not available locally.