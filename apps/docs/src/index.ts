import { loaderRegistry, renderLoader } from '@wavelo/core';
import { allStyles } from '@wavelo/core/css';
import { stylesheetMarkup } from '@wavelo/core/styles';

const version = '0.4.0';

const totalCount = loaderRegistry.length;
const categoryCounts = loaderRegistry.reduce((acc, l) => {
  acc[l.category] = (acc[l.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const designs = loaderRegistry.map((loader) => `<option value="${loader.id}">${loader.name}</option>`).join('');

const cards = loaderRegistry.map((loader) => `
<article class="card${loader.deprecated ? ' deprecated' : ''}" data-category="${loader.category}" data-dimension="${loader.dimension}" data-id="${loader.id}" data-name="${loader.name.toLowerCase()}" data-deprecated="${loader.deprecated ? 'true' : 'false'}" data-options="${loader.options.join(',')}">
  <div class="preview">${renderLoader({ type: loader.id }).html}</div>
  <div class="meta-wrap">
    <div class="meta-head">
      <h3 class="meta-title">${loader.name}${loader.deprecated ? ' <span class="badge badge-dep">deprecated</span>' : ''}</h3>
      <span class="badge badge-dim">${loader.dimension.toUpperCase()}</span>
    </div>
    <div class="meta-sub">
      <button type="button" class="btn-copy-id" data-id="${loader.id}" title="Copy design ID: ${loader.id}">
        <code class="meta-code">type: '${loader.id}'</code>
        <svg class="copy-id-icon" aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      </button>
      <div>${loader.id === 'constellation' ? '<span class="badge badge-feat" title="5 Astronomical Patterns: Ursa Major, Orion, Cassiopeia, Cygnus, Ursa Minor">5 Patterns</span> ' : ''}<span class="badge badge-cat">${loader.category}</span></div>
    </div>
    <div class="quick-swatches" aria-label="Quick preview colors">
      <button type="button" class="quick-dot active" style="background:#6366f1" data-color="#6366f1" title="Indigo" aria-label="Set card color to indigo"></button>
      <button type="button" class="quick-dot" style="background:#10b981" data-color="#10b981" title="Emerald" aria-label="Set card color to emerald"></button>
      <button type="button" class="quick-dot" style="background:#0ea5e9" data-color="#0ea5e9" title="Sky" aria-label="Set card color to sky"></button>
      <button type="button" class="quick-dot" style="background:#f43f5e" data-color="#f43f5e" title="Rose" aria-label="Set card color to rose"></button>
      <button type="button" class="quick-dot" style="background:#f59e0b" data-color="#f59e0b" title="Amber" aria-label="Set card color to amber"></button>
    </div>
    <div class="action-bar" aria-label="${loader.name} actions">
      <button type="button" class="btn-card-action btn-test-card" data-id="${loader.id}" aria-label="Test ${loader.name} in studio">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg> Studio
      </button>
      <button type="button" class="btn-card-action btn-copy-card" data-id="${loader.id}" aria-label="Copy code for ${loader.name}" aria-haspopup="menu" aria-expanded="false">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy
      </button>
      <button type="button" class="btn-card-action btn-info-card" data-id="${loader.id}" aria-label="View API info for ${loader.name}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> API
      </button>
    </div>
  </div>
</article>`).join('');

const html = `<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Wavelo — Motion made simple</title>
<style>
:root, [data-theme="dark"] {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --bg-body: #090d16;
  --bg-header: rgba(9, 13, 22, 0.92);
  --bg-card: #0f172a;
  --bg-card-hover: #162238;
  --bg-subtle: #1e293b;
  --bg-stage: #030712;
  --border-card: #1e293b;
  --border-subtle: #334155;
  --border-focus: #4f46e5;
  --text-main: #f8fafc;
  --text-muted: #cbd5e1;
  --text-dim: #94a3b8;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-subtle: #1e1b4b;
  --accent-text: #c7d2fe;
  --code-bg: #030712;
  --code-text: #f8fafc;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 10px 30px -4px rgba(0, 0, 0, 0.7), 0 0 20px -2px rgba(79, 70, 229, 0.25);
}
:root[data-theme="light"], [data-theme="light"] {
  --bg-body: #f8fafc;
  --bg-header: rgba(248, 250, 252, 0.92);
  --bg-card: #ffffff;
  --bg-card-hover: #f1f5f9;
  --bg-subtle: #f1f5f9;
  --bg-stage: #ffffff;
  --border-card: #e2e8f0;
  --border-subtle: #cbd5e1;
  --border-focus: #4338ca;
  --text-main: #0f172a;
  --text-muted: #334155;
  --text-dim: #475569;
  --accent: #4338ca;
  --accent-hover: #3730a3;
  --accent-subtle: #e0e7ff;
  --accent-text: #312e81;
  --code-bg: #0f172a;
  --code-text: #f8fafc;
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 10px 25px -4px rgba(67, 56, 202, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
body { margin: 0; font-family: var(--font-sans); color: var(--text-main); background: var(--bg-body); line-height: 1.5; -webkit-font-smoothing: antialiased; }

/* Sticky Navbar */
.site-header { position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: var(--bg-header); border-bottom: 1px solid var(--border-card); }
.header-container { max-width: 1240px; margin: 0 auto; padding: 0.85rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: inherit; }
.brand-logo { width: 32px; height: 32px; border-radius: var(--radius-md); background: linear-gradient(135deg, #4f46e5, #9333ea); display: grid; place-items: center; color: white; }
.brand-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
.badge { display: inline-flex; align-items: center; font-size: 0.72rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 9999px; line-height: 1.3; }
.badge-version { background: var(--accent-subtle); color: var(--accent-text); border: 1px solid var(--accent); }
.badge-count { background: var(--bg-subtle); color: var(--text-muted); border: 1px solid var(--border-subtle); }
.nav-actions { display: flex; align-items: center; gap: 0.75rem; }
.nav-link { color: var(--text-muted); font-size: 0.875rem; font-weight: 500; text-decoration: none; padding: 0.4rem 0.75rem; border-radius: var(--radius-md); transition: color 0.15s, background 0.15s; }
.nav-link:hover { color: var(--text-main); background: var(--bg-subtle); }
.btn-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-card); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.btn-icon:hover { color: var(--text-main); border-color: var(--accent); background: var(--bg-card-hover); }

/* Main Layout */
.page-wrapper { max-width: 1240px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

/* Hero Section */
.hero { text-align: center; padding: 2.5rem 1rem 3.5rem; max-width: 820px; margin: 0 auto; }
.hero-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; border-radius: 9999px; background: var(--accent-subtle); border: 1px solid var(--accent); color: var(--accent-text); font-size: 0.8rem; font-weight: 600; margin-bottom: 1.25rem; }
.hero-title { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; letter-spacing: -0.03em; margin: 0 0 1rem; line-height: 1.15; background: linear-gradient(135deg, var(--text-main) 60%, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-subtitle { font-size: clamp(1rem, 2vw, 1.2rem); color: var(--text-muted); margin: 0 0 1.75rem; line-height: 1.6; }
.hero-badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin-bottom: 2rem; }
.hero-badge-item { font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.8rem; border-radius: var(--radius-md); background: var(--bg-card); border: 1px solid var(--border-subtle); color: var(--text-muted); }

/* Terminal Command Box (Invariant Dark Styling for pristine contrast) */
.terminal-box { max-width: 620px; margin: 0 auto; background: #030712; border: 1px solid #1e293b; border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 10px 30px -4px rgba(0, 0, 0, 0.4); text-align: left; }
.terminal-header { display: flex; align-items: center; justify-content: space-between; padding: 0.55rem 0.9rem; background: #0f172a; border-bottom: 1px solid #1e293b; gap: 0.75rem; flex-wrap: wrap; }
.terminal-dots { display: flex; gap: 0.35rem; }
.t-dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-red { background: #ef4444; } .dot-yellow { background: #f59e0b; } .dot-green { background: #10b981; }
.terminal-tabs { display: flex; gap: 0.25rem; }
.t-tab { background: transparent; border: none; color: #94a3b8; font-size: 0.78rem; font-weight: 600; padding: 0.3rem 0.65rem; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s; }
.t-tab.active { color: #ffffff; background: #4f46e5; }
.t-tab:hover:not(.active) { color: #f8fafc; background: rgba(255, 255, 255, 0.08); }
.terminal-body { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.1rem; gap: 1rem; background: #030712; }
.terminal-cmd { font-family: var(--font-mono); font-size: 0.88rem; color: #c7d2fe; word-break: break-all; }
.btn-copy-install { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.85rem; font-size: 0.78rem; font-weight: 600; border-radius: var(--radius-sm); border: 1px solid #334155; background: #1e293b; color: #f8fafc; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
.btn-copy-install:hover { background: #4f46e5; color: #ffffff; border-color: #4f46e5; }

/* Interactive Studio / Workbench */
.studio-section { margin-bottom: 4rem; scroll-margin-top: 5rem; }
.section-headline { margin-bottom: 1.5rem; }
.section-headline h2 { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 0.35rem; }
.section-headline p { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
.studio-workbench { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.25fr); gap: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-xl); padding: 1.5rem; box-shadow: var(--shadow-card); align-items: start; }
@media (max-width: 960px) { .studio-workbench { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 640px) {
  html, body { overflow-x: hidden; }
  .header-container { padding: 0.75rem 1rem; }
  .nav-actions { gap: 0.4rem; }
  .nav-link { display: none; }
  .page-wrapper { padding: 1.5rem 1rem 3rem; }
  .filter-row-top { flex-direction: column; align-items: stretch; }
  .search-wrapper { min-width: 0; width: 100%; }
  .category-tabs { max-width: 100%; }
}

/* Studio Left: Canvas Column */
.canvas-column { display: flex; flex-direction: column; gap: 1rem; }
.canvas-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; font-size: 0.78rem; }
.canvas-modes { display: flex; gap: 0.25rem; background: var(--bg-subtle); padding: 0.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
.mode-btn { background: transparent; border: none; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s; }
.mode-btn.active { background: var(--accent); color: #ffffff; }
.mode-btn:hover:not(.active) { color: var(--text-main); background: var(--border-subtle); }
.stage-wrapper { position: relative; border-radius: var(--radius-lg); border: 1px solid var(--border-card); overflow: hidden; min-height: 380px; display: grid; place-items: center; transition: background 0.2s; background: var(--bg-stage); }
.stage { width: 100%; height: 100%; min-height: 380px; display: grid; place-items: center; padding: 2rem; position: relative; transition: background 0.2s ease; overflow: hidden; }
.stage.stage-light { background: #ffffff !important; }
.stage.stage-dim { background: #0f172a !important; }
.stage.stage-dark { background: #030712 !important; }
.stage.stage-black { background: #000000 !important; }
.stage.stage-brand { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%) !important; }

.stage-footer-info { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0 0.25rem; }
.stage-pill { font-size: 0.78rem; font-weight: 600; color: var(--text-main); }
.pill-sub { color: var(--text-dim); font-family: var(--font-mono); font-size: 0.72rem; }

/* Real-World Context Mocks */
.mock-btn { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.4rem; border-radius: var(--radius-md); background: linear-gradient(135deg, #4f46e5, #6366f1); color: #ffffff; font-weight: 600; font-size: 0.88rem; border: none; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); }
.mock-card { width: 290px; border-radius: var(--radius-xl); padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2); transition: all 0.2s ease; }
.mock-card-lines { width: 100%; display: flex; flex-direction: column; gap: 0.5rem; }
.mock-line { height: 8px; border-radius: 4px; width: 100%; }
.mock-line.short { width: 60%; }
.mock-table { width: 100%; max-width: 380px; border-radius: var(--radius-lg); overflow: hidden; font-size: 0.82rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15); transition: all 0.2s ease; }
.mock-row { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.25rem; gap: 1rem; }
.mock-row span { font-weight: 600; }
.mock-row .status-text { font-size: 0.78rem; font-weight: 500; }

/* Stage-specific mock styling (Context adaptation independent of page theme) */
.stage.stage-dark .mock-card,
.stage.stage-dark .mock-table { background: #0f172a; border: 1px solid #1e293b; color: #f8fafc; }
.stage.stage-dark .mock-line { background: #1e293b; }
.stage.stage-dark .mock-row { border-bottom: 1px solid #1e293b; }
.stage.stage-dark .mock-row span { color: #f8fafc; }
.stage.stage-dark .mock-row .status-text { color: #94a3b8; }

.stage.stage-dim .mock-card,
.stage.stage-dim .mock-table { background: #1e293b; border: 1px solid #334155; color: #f8fafc; }
.stage.stage-dim .mock-line { background: #334155; }
.stage.stage-dim .mock-row { border-bottom: 1px solid #334155; }
.stage.stage-dim .mock-row span { color: #f8fafc; }
.stage.stage-dim .mock-row .status-text { color: #cbd5e1; }

.stage.stage-light .mock-card,
.stage.stage-light .mock-table { background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a; }
.stage.stage-light .mock-line { background: #e2e8f0; }
.stage.stage-light .mock-row { border-bottom: 1px solid #e2e8f0; }
.stage.stage-light .mock-row span { color: #0f172a; }
.stage.stage-light .mock-row .status-text { color: #475569; }

.stage.stage-black .mock-card,
.stage.stage-black .mock-table { background: #0a0a0a; border: 1px solid #1a1a1a; color: #f8fafc; }
.stage.stage-black .mock-line { background: #1a1a1a; }
.stage.stage-black .mock-row { border-bottom: 1px solid #1a1a1a; }
.stage.stage-black .mock-row span { color: #f8fafc; }
.stage.stage-black .mock-row .status-text { color: #a1a1aa; }

.stage.stage-brand .mock-card,
.stage.stage-brand .mock-table { background: rgba(30, 27, 75, 0.75); border: 1px solid rgba(99, 102, 241, 0.35); color: #e0e7ff; backdrop-filter: blur(8px); }
.stage.stage-brand .mock-line { background: rgba(99, 102, 241, 0.35); }
.stage.stage-brand .mock-row { border-bottom: 1px solid rgba(99, 102, 241, 0.2); }
.stage.stage-brand .mock-row span { color: #e0e7ff; }
.stage.stage-brand .mock-row .status-text { color: #c7d2fe; }

/* Studio Right: Controls Column */
.controls-column { display: flex; flex-direction: column; gap: 1.1rem; min-width: 0; }
.framework-tab-bar { display: flex; gap: 0.3rem; flex-wrap: wrap; background: var(--bg-subtle); padding: 0.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); }
.fw-tab { flex: 1; min-width: 65px; background: transparent; border: none; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); padding: 0.4rem 0.5rem; border-radius: var(--radius-sm); cursor: pointer; text-align: center; transition: all 0.15s; }
.fw-tab.active { background: var(--accent); color: #ffffff; }
.fw-tab:hover:not(.active) { color: var(--text-main); background: var(--border-subtle); }
.field-grid { display: grid; gap: 0.75rem; min-width: 0; }
.ctrl-row { display: grid; grid-template-columns: 6.5rem minmax(0, 1fr) 3.5rem; align-items: center; gap: 0.75rem; font-size: 0.82rem; min-width: 0; }
.ctrl-row label { font-weight: 600; color: var(--text-muted); }
.ctrl-row output { font-family: var(--font-mono); font-size: 0.78rem; text-align: right; color: var(--text-muted); font-variant-numeric: tabular-nums; }
select, input[type=range], input[type=search] { width: 100%; box-sizing: border-box; }
select { padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-subtle); color: var(--text-main); font-size: 0.82rem; font-family: inherit; }
select:focus, input:focus { outline: none; border-color: var(--border-focus); }

/* Range Slider Styling */
input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; height: 18px; margin: 0; }
input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; background: var(--bg-subtle); border: 1px solid var(--border-subtle); }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); border: 2px solid #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.3); margin-top: -6px; transition: transform 0.15s, box-shadow 0.15s; }
input[type=range]:focus::-webkit-slider-thumb { box-shadow: 0 0 0 4px var(--accent-subtle); }

/* Preset Segmented Buttons */
.preset-segments { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.preset-btn { flex: 1; min-width: 0; padding: 0.35rem; font-size: 0.75rem; font-weight: 600; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: var(--bg-subtle); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.preset-btn.active { color: #ffffff; background: var(--accent); border-color: var(--accent); }
.preset-btn:hover:not(.active) { color: var(--text-main); border-color: var(--border-focus); }

/* Color Palette Swatches & Integrated Picker */
.swatches { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.color-picker-wrap { position: relative; width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--border-subtle); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.2); overflow: clip; }
.color-picker-wrap:hover { transform: scale(1.1); }
.color-picker-wrap input[type=color] { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.swatch, .swatch-sec { width: 22px; height: 22px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; flex-shrink: 0; }
.swatch:hover, .swatch-sec:hover { transform: scale(1.15); }
.swatch.active, .swatch-sec.active { border-color: #ffffff; box-shadow: 0 0 0 2px var(--accent); }

/* Clean iOS-Style Switches */
.switch-row { display: flex; flex-wrap: wrap; gap: 1.25rem; font-size: 0.85rem; padding-top: 0.2rem; }
.switch-label { display: inline-flex; align-items: center; gap: 0.55rem; cursor: pointer; font-weight: 500; color: var(--text-muted); position: relative; user-select: none; }
.switch-label input[type=checkbox] { position: absolute; opacity: 0; width: 1px; height: 1px; }
.switch-toggle { position: relative; width: 34px; height: 20px; background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: 10px; transition: background 0.2s, border-color 0.2s; display: inline-block; }
.switch-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); transition: transform 0.2s; }
.switch-label input[type=checkbox]:checked + .switch-toggle { background: var(--accent); border-color: var(--accent); }
.switch-label input[type=checkbox]:checked + .switch-toggle::after { transform: translateX(14px); }

@media (max-width: 520px) {
  .ctrl-row { grid-template-columns: 1fr auto; gap: 0.4rem; }
  .ctrl-row label { grid-column: 1 / 2; }
  .ctrl-row output { grid-column: 2 / 3; }
  .ctrl-row select, .ctrl-row input[type=range], .ctrl-row .preset-segments, .ctrl-row .swatches { grid-column: 1 / -1; width: 100%; }
}

/* Code Box */
.code-panel { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem; }
.code-header { display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
pre#code { margin: 0; padding: 1rem; background: var(--code-bg); color: var(--code-text); border-radius: var(--radius-lg); font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.6; border: 1px solid var(--border-card); overflow: auto; max-height: 220px; white-space: pre-wrap; }
pre#code:focus { outline: 2px solid var(--border-focus); }
.btn-copy-code { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.45rem 0.9rem; font-size: 0.78rem; font-weight: 600; border-radius: var(--radius-sm); border: none; background: var(--accent); color: #ffffff; cursor: pointer; transition: background 0.15s; }
.btn-copy-code:hover { background: var(--accent-hover); }

/* Showcase Section & Sticky Filter Bar */
.showcase-section { scroll-margin-top: 5rem; }
.filter-bar { position: sticky; top: 58px; z-index: 40; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); background: var(--bg-header); border: 1px solid var(--border-card); border-radius: var(--radius-lg); padding: 0.75rem 1rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: var(--shadow-card); }
.filter-row-top { display: flex; gap: 0.75rem; align-items: center; justify-content: space-between; flex-wrap: wrap; }
.search-wrapper { position: relative; flex: 1; min-width: 240px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-dim); pointer-events: none; }
input#search { padding: 0.55rem 0.75rem 0.55rem 2.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-subtle); color: var(--text-main); font-size: 0.85rem; }
.category-tabs { display: flex; gap: 0.35rem; overflow-x: auto; padding-bottom: 0.2rem; scrollbar-width: none; }
.category-tabs::-webkit-scrollbar { display: none; }
.cat-tab { white-space: nowrap; font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 9999px; border: 1px solid var(--border-subtle); background: var(--bg-subtle); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.cat-tab.active { background: var(--accent); color: #ffffff; border-color: var(--accent); }
.cat-tab:hover:not(.active) { color: var(--text-main); background: var(--border-subtle); }
.filter-count { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; }

/* Component Cards Grid */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
.card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-lg); overflow: hidden; display: flex; flex-direction: column; position: relative; box-shadow: var(--shadow-card); transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease; content-visibility: auto; contain-intrinsic-size: 240px 240px; }
.card[hidden] { display: none !important; }
.card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover); border-color: var(--accent); }
.preview { height: 8.5rem; display: flex; align-items: center; justify-content: center; overflow: hidden; background: linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(255, 255, 255, 0.02)); border-bottom: 1px solid var(--border-card); }
.preview .wavelo--fullscreen { position: relative; inset: auto; width: 100%; height: 100%; min-width: 0; min-height: 0; }
.preview .wavelo--progress-top { position: relative; top: auto; left: auto; width: 100%; }
.preview .wavelo--skeleton,
.preview .wavelo--page-skeleton,
.preview .wavelo--image-placeholder { transform: scale(0.5); transform-origin: center center; flex-shrink: 0; }

.meta-wrap { padding: 0.9rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.meta-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.meta-title { font-size: 0.95rem; font-weight: 600; margin: 0; }
.badge-dep { background: #ef444425; color: #fca5a5; font-size: 0.65rem; border: 1px solid #ef4444; }
.badge-dim { background: #f1f5f9; color: #0f172a; font-size: 0.68rem; font-weight: 700; border: 1px solid #cbd5e1; }
[data-theme="dark"] .badge-dim { background: #1e293b; color: #f8fafc; border-color: #334155; }
.badge-cat { background: #eef2ff; color: #3730a3; font-size: 0.68rem; font-weight: 700; border: 1px solid #c7d2fe; }
[data-theme="dark"] .badge-cat { background: #1e1b4b; color: #c7d2fe; border-color: #4338ca; }
.badge-feat { background: #fdf4ff; color: #7e22ce; font-size: 0.68rem; font-weight: 700; border: 1px solid #e9d5ff; }
[data-theme="dark"] .badge-feat { background: #3b0764; color: #f0abfc; border-color: #7e22ce; }
.meta-sub { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 0.75rem; }
.meta-code { color: var(--text-muted); font-family: var(--font-mono); }

/* Design ID Copy Buttons */
.btn-copy-id {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 0.15rem 0.45rem;
  font-size: 0.74rem;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--text-muted);
}
.btn-copy-id:hover {
  background: var(--accent-subtle);
  border-color: var(--accent);
  color: var(--accent-text);
}
.btn-copy-id:hover .meta-code {
  color: var(--accent-text);
}
.btn-copy-id:hover .copy-id-icon {
  color: var(--accent);
}
.copy-id-icon {
  flex-shrink: 0;
  color: var(--text-dim);
  transition: color 0.15s ease, transform 0.15s ease;
}
.btn-copy-id:active .copy-id-icon {
  transform: scale(0.9);
}
.btn-copy-id.copied, .stage-pill-btn.copied, .modal-pill-btn.copied {
  background: rgba(16, 185, 129, 0.15) !important;
  border-color: #10b981 !important;
  color: #10b981 !important;
}
.btn-copy-id.copied .meta-code, .stage-pill-btn.copied code, .modal-pill-btn.copied code {
  color: #10b981 !important;
}
.btn-copy-id.copied .copy-id-icon, .stage-pill-btn.copied .copy-id-icon, .modal-pill-btn.copied .copy-id-icon {
  color: #10b981 !important;
}

.stage-pill-btn, .modal-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  border: 1px solid var(--border-subtle);
  background: var(--bg-subtle);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  transition: all 0.15s ease;
  color: var(--text-main);
}
.stage-pill-btn:hover, .modal-pill-btn:hover {
  background: var(--accent-subtle);
  border-color: var(--accent);
  color: var(--accent-text);
}
.stage-pill-btn:hover code, .modal-pill-btn:hover code {
  color: var(--accent-text);
}
.stage-pill-btn:hover .copy-id-icon, .modal-pill-btn:hover .copy-id-icon {
  color: var(--accent);
}

/* Card Action Bar (Always visible in card footer, elegant styling) */
.action-bar { display: flex; align-items: center; gap: 0.35rem; margin-top: 0.25rem; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle); }
.btn-card-action { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem; padding: 0.35rem 0.4rem; border-radius: var(--radius-sm); font-size: 0.72rem; font-weight: 600; border: 1px solid var(--border-subtle); background: var(--bg-subtle); color: var(--text-muted); cursor: pointer; transition: all 0.15s; }
.btn-card-action:hover { background: var(--accent); color: #ffffff; border-color: var(--accent); }

/* In-Card Quick Color Swatches */
.quick-swatches { display: flex; align-items: center; gap: 0.35rem; padding: 0.15rem 0; }
.quick-dot { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid transparent; cursor: pointer; padding: 0; transition: transform 0.15s ease, border-color 0.15s ease; flex-shrink: 0; }
.quick-dot:hover { transform: scale(1.25); }
.quick-dot.active { border-color: #ffffff; box-shadow: 0 0 0 1px var(--accent); }

/* WCAG 2.2 Contrast Badges & Indicators */
.contrast-badge { font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: var(--radius-sm); letter-spacing: 0.02em; display: inline-flex; align-items: center; gap: 0.25rem; }
.contrast-good, .pill-good { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
.contrast-warn, .pill-warn { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
.stage-pill.pill-contrast { font-weight: 700; }

/* Modal Snippet Framework Tabs */
.modal-snippet-section { background: var(--bg-subtle); border: 1px solid var(--border-card); border-radius: var(--radius-lg); padding: 1rem 1.2rem; display: flex; flex-direction: column; gap: 0.65rem; }
.modal-snippet-header { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.btn-copy-modal-snippet { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.75rem; border-radius: var(--radius-sm); background: var(--accent); color: #fff; border: none; cursor: pointer; transition: all 0.15s ease; }
.btn-copy-modal-snippet:hover { background: var(--accent-hover); }
.btn-copy-modal-snippet.copied { background: #10b981 !important; color: #fff !important; }
.modal-fw-tabs { display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 0.25rem; }
.modal-fw-tab { font-size: 0.74rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: var(--radius-sm); background: transparent; border: 1px solid var(--border-subtle); color: var(--text-muted); cursor: pointer; transition: all 0.12s ease; }
.modal-fw-tab:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-main); }
.modal-fw-tab.active { background: var(--accent); border-color: var(--accent); color: #fff; }

/* API Modal */
.modal-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(6px); display: grid; place-items: center; padding: 1.5rem; }
.modal-backdrop[hidden] { display: none !important; }
.modal-card { width: 100%; max-width: 680px; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-hover); overflow: hidden; animation: modalPop 0.18s ease-out; }
@keyframes modalPop { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-card); background: rgba(255, 255, 255, 0.02); }
.modal-headline { font-size: 1.25rem; font-weight: 700; margin: 0; }
.modal-sub { font-size: 0.8rem; color: var(--text-muted); }
.modal-close-btn { background: transparent; border: none; font-size: 1.25rem; color: var(--text-muted); cursor: pointer; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); }
.modal-close-btn:hover { color: var(--text-main); background: var(--bg-subtle); }
.modal-body { padding: 1.5rem; max-height: 70vh; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.85rem; }
.modal-meta-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.modal-pill { font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 9999px; background: var(--bg-subtle); border: 1px solid var(--border-subtle); color: var(--text-main); }
.modal-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
.modal-table th, .modal-table td { padding: 0.55rem 0.75rem; text-align: left; border-bottom: 1px solid var(--border-card); }
.modal-table th { color: var(--text-main); font-weight: 600; background: var(--bg-subtle); }
.modal-table td { color: var(--text-muted); }
.modal-table code { font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent); }
[data-theme="dark"] .modal-table code { color: var(--accent-text); }

/* Modal Doc Specialized Sections */
.modal-doc-box { background: var(--bg-subtle); border: 1px solid var(--border-card); border-radius: var(--radius-lg); padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.modal-doc-title { display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem; font-weight: 700; color: var(--text-main); margin: 0; }
.modal-doc-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.55; margin: 0; }
.pattern-chips { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.5rem; }
.pattern-chip { display: flex; flex-direction: column; text-align: left; gap: 0.2rem; padding: 0.5rem 0.65rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.76rem; color: var(--text-main); cursor: pointer; transition: all 0.15s; }
.pattern-chip:hover { border-color: var(--accent); background: var(--bg-hover); transform: translateY(-1px); }
.pattern-chip-name { font-weight: 700; display: flex; align-items: center; justify-content: space-between; }
.pattern-chip-code { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent); }
[data-theme="dark"] .pattern-chip-code { color: var(--accent-text); }
.pattern-chip-desc { font-size: 0.7rem; color: var(--text-dim); }
.modal-code-sample { background: #090d16; color: #e2e8f0; border: 1px solid #1e293b; border-radius: var(--radius-md); padding: 0.75rem; font-family: var(--font-mono); font-size: 0.74rem; line-height: 1.5; overflow-x: auto; margin: 0; }

/* Floating Framework Copy Popover */
.copy-popover {
  position: fixed;
  z-index: 1000;
  width: 290px;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  animation: popoverFadeIn 0.15s ease-out;
}
.copy-popover[hidden] { display: none !important; }
@keyframes popoverFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.copy-popover-header {
  padding: 0.35rem 0.6rem 0.45rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 0.4rem;
}
.copy-popover-title {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-dim);
}
.copy-popover-target {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-text);
  background: var(--accent-subtle);
  padding: 0.12rem 0.55rem;
  border-radius: 9999px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.copy-popover-list {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
}
.popover-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.42rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-main);
  font-size: 0.8rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all 0.12s ease;
  white-space: nowrap;
}
.popover-item:hover, .popover-item:focus-visible {
  background: var(--accent);
  color: #ffffff;
  border-color: var(--accent);
  outline: none;
}
.popover-item:hover .popover-fw-tag, .popover-item:focus-visible .popover-fw-tag {
  color: rgba(255, 255, 255, 0.85);
}
.popover-fw-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-sm);
  background: var(--bg-subtle);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  min-width: 48px;
  text-align: center;
}
.popover-item:hover .popover-fw-badge, .popover-item:focus-visible .popover-fw-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}
.popover-fw-name {
  font-weight: 600;
  white-space: nowrap;
}
.popover-fw-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--text-dim);
  margin-left: auto;
  white-space: nowrap;
}
.popover-item.copied {
  background: #10b981 !important;
  color: #ffffff !important;
  border-color: #10b981 !important;
}

/* Toast */
.toast { position: fixed; bottom: 2rem; right: 2rem; z-index: 90; background: var(--accent); color: white; padding: 0.65rem 1.25rem; border-radius: var(--radius-md); font-size: 0.82rem; font-weight: 600; box-shadow: var(--shadow-hover); transform: translateY(100px); opacity: 0; pointer-events: none; transition: transform 0.2s ease, opacity 0.2s ease; }
.toast.show { transform: translateY(0); opacity: 1; pointer-events: auto; }

/* Site Footer */
.site-footer { border-top: 1px solid var(--border-card); padding: 3rem 1.5rem; text-align: center; color: var(--text-dim); font-size: 0.85rem; margin-top: 4rem; }
.footer-links { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; }
.footer-links a { color: var(--text-muted); text-decoration: none; }
.footer-links a:hover { color: var(--accent); }
</style>${stylesheetMarkup(allStyles)}</head><body>

<header class="site-header">
  <div class="header-container">
    <a href="#" class="brand">
      <div class="brand-logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12c.6 0 1.2-.4 1.4-1 1-3.5 3.1-6 6.6-6 4 0 5 4 8 4s3.4-2.5 4-4"/><path d="M2 18c.6 0 1.2-.4 1.4-1 1-3.5 3.1-6 6.6-6 4 0 5 4 8 4s3.4-2.5 4-4"/></svg>
      </div>
      <span class="brand-title">Wavelo</span>
      <span class="badge badge-version">v${version}</span>
    </a>
    <nav class="nav-actions" aria-label="Site navigation">
      <a href="#studio" class="nav-link">Studio</a>
      <a href="#showcase" class="nav-link">Showcase</a>
      <a href="https://github.com/princegoel0/wavelo" class="nav-link" target="_blank" rel="noopener">GitHub</a>
      <button type="button" id="theme-toggle" class="btn-icon" aria-label="Toggle color theme">
        <svg id="theme-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </button>
    </nav>
  </div>
</header>

<div class="page-wrapper">
  <!-- Hero Section -->
  <section class="hero" aria-label="Introduction">
    <div class="hero-pill">✨ ${totalCount} Production-Ready Loaders · Zero Runtime Dependencies</div>
    <h1 class="hero-title">Wavelo — Motion made simple.</h1>
    <p class="hero-subtitle">Lightweight, accessible, framework-agnostic loading states and skeletons for modern web apps.</p>
    <div class="hero-badges">
      <span class="hero-badge-item">⚡ ${totalCount}+ Loaders</span>
      <span class="hero-badge-item">📦 Zero Dependencies</span>
      <span class="hero-badge-item">🛡️ SSR Safe</span>
      <span class="hero-badge-item">🔷 Full TypeScript</span>
      <span class="hero-badge-item">♿ ARIA Compliant</span>
    </div>
    
    <div class="terminal-box" aria-label="Quick install command">
      <div class="terminal-header">
        <div class="terminal-dots">
          <span class="t-dot dot-red"></span>
          <span class="t-dot dot-yellow"></span>
          <span class="t-dot dot-green"></span>
        </div>
        <div class="terminal-tabs" aria-label="Package managers">
          <button type="button" class="t-tab active" data-pkg="npm">npm</button>
          <button type="button" class="t-tab" data-pkg="pnpm">pnpm</button>
          <button type="button" class="t-tab" data-pkg="yarn">yarn</button>
          <button type="button" class="t-tab" data-pkg="bun">bun</button>
        </div>
      </div>
      <div class="terminal-body">
        <code id="install-cmd" class="terminal-cmd">npm i @wavelo/react</code>
        <button type="button" id="copy-install" class="btn-copy-install">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span id="copy-install-text">Copy</span>
        </button>
      </div>
    </div>
  </section>

  <!-- Interactive Studio / Playground -->
  <section id="studio" class="studio-section" aria-label="Configuration playground">
    <div class="section-headline">
      <h2>Interactive Live Studio</h2>
      <p>Configure parameters, test against real-world simulated contexts, and generate framework-idiomatic code.</p>
    </div>

    <div class="studio-workbench">
      <!-- Left Column: Canvas Column -->
      <div class="canvas-column">
        <div class="canvas-toolbar">
          <div class="canvas-modes" aria-label="Stage background">
            <button type="button" class="mode-btn active" data-bg="dark">Dark</button>
            <button type="button" class="mode-btn" data-bg="dim">Dim</button>
            <button type="button" class="mode-btn" data-bg="light">Light</button>
            <button type="button" class="mode-btn" data-bg="black">Black #000</button>
            <button type="button" class="mode-btn" data-bg="brand">Brand</button>
          </div>
          <div class="canvas-modes" aria-label="Simulated UI context">
            <button type="button" class="mode-btn active" data-ctx="isolated">Isolated</button>
            <button type="button" class="mode-btn" data-ctx="button">Button</button>
            <button type="button" class="mode-btn" data-ctx="card">Card</button>
            <button type="button" class="mode-btn" data-ctx="table">Table</button>
          </div>
        </div>

        <div class="stage-wrapper">
          <div class="stage stage-dark" id="stage"></div>
        </div>

        <div class="stage-footer-info">
          <span id="stage-design-name" class="stage-pill">Circular border</span>
          <button type="button" id="btn-copy-stage-id" class="stage-pill stage-pill-btn" title="Copy design ID for code">
            <code id="stage-design-id">type: 'circular'</code>
            <svg class="copy-id-icon" aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
          <span id="stage-spec-badge" class="stage-pill pill-sub">2D · 48px · 1s</span>
          <span id="stage-contrast-pill" class="stage-pill pill-contrast pill-good" title="WCAG 2.2 Relative Contrast Ratio">WCAG: 4.5:1 AA</span>
        </div>
      </div>

      <!-- Right Column: Controls Column -->
      <div class="controls-column">
        <div class="framework-tab-bar" aria-label="Target framework">
          <button type="button" class="fw-tab active" data-fw="core">Core</button>
          <button type="button" class="fw-tab" data-fw="html">HTML &amp; CSS</button>
          <button type="button" class="fw-tab" data-fw="react">React</button>
          <button type="button" class="fw-tab" data-fw="vue">Vue</button>
          <button type="button" class="fw-tab" data-fw="svelte">Svelte</button>
          <button type="button" class="fw-tab" data-fw="angular">Angular</button>
          <button type="button" class="fw-tab" data-fw="vanilla">Vanilla</button>
          <button type="button" class="fw-tab" data-fw="web-components">Web Comp</button>
        </div>
        <select id="framework" aria-label="Target framework" hidden>
          <option value="core" selected>Core</option>
          <option value="html">HTML &amp; CSS</option>
          <option value="react">React</option>
          <option value="vue">Vue</option>
          <option value="svelte">Svelte</option>
          <option value="angular">Angular</option>
          <option value="vanilla">Vanilla</option>
          <option value="web-components">Web Component</option>
        </select>

        <div class="field-grid">
          <div class="ctrl-row">
            <label for="design">Design</label>
            <select id="design" aria-label="Select loader design">${designs}</select>
            <output></output>
          </div>

          <!-- Dynamic Pattern Selector (Constellation, etc.) -->
          <div class="ctrl-row" id="row-variant" hidden>
            <label for="variant-select">Pattern</label>
            <select id="variant-select" aria-label="Select astronomical constellation pattern">
              <option value="ursa-major" selected>Ursa Major (Big Dipper)</option>
              <option value="orion">Orion (The Hunter)</option>
              <option value="cassiopeia">Cassiopeia (The Queen)</option>
              <option value="cygnus">Cygnus (The Swan)</option>
              <option value="ursa-minor">Ursa Minor (Little Dipper)</option>
            </select>
            <output></output>
          </div>

          <!-- Dynamic Interaction State Selector (Stateful Loaders) -->
          <div class="ctrl-row" id="row-state" hidden>
            <label for="state-select">State</label>
            <select id="state-select" aria-label="Select loader interaction state">
              <option value="loading" selected>loading (active sync)</option>
              <option value="success">success (confirmed check)</option>
              <option value="error">error (failed alert)</option>
              <option value="idle">idle (paused/dim)</option>
            </select>
            <output></output>
          </div>

          <div class="ctrl-row">
            <label>Preset</label>
            <div class="preset-segments">
              <button type="button" class="preset-btn" data-size="24">Small</button>
              <button type="button" class="preset-btn active" data-size="48">Medium</button>
              <button type="button" class="preset-btn" data-size="80">Large</button>
              <button type="button" class="preset-btn" data-size="96">Giant</button>
            </div>
            <output></output>
          </div>

          <div class="ctrl-row">
            <label for="size">Size</label>
            <input id="size" type="range" min="16" max="120" step="4" value="48" aria-label="Loader size in pixels">
            <output for="size">48px</output>
          </div>

          <div class="ctrl-row">
            <label for="stroke">Stroke</label>
            <input id="stroke" type="range" min="1" max="14" step="1" value="3" aria-label="Stroke width in pixels">
            <output for="stroke">3px</output>
          </div>

          <div class="ctrl-row">
            <label for="duration">Duration</label>
            <input id="duration" type="range" min="0.2" max="4" step="0.1" value="1" aria-label="Animation duration in seconds">
            <output for="duration">1s</output>
          </div>

          <div class="ctrl-row">
            <label for="radius">Radius</label>
            <input id="radius" type="range" min="0" max="24" step="1" value="6" aria-label="Border radius in pixels">
            <output for="radius">6px</output>
          </div>

          <div class="ctrl-row" id="row-count">
            <label for="count">Count</label>
            <input id="count" type="range" min="1" max="12" step="1" value="3" aria-label="Part or track count">
            <output for="count">3 tracks</output>
          </div>

          <div class="ctrl-row" id="row-progress">
            <label for="progress">Value</label>
            <input id="progress" type="range" min="0" max="100" step="1" value="35" aria-label="Determinate progress value percentage">
            <output for="progress">35%</output>
          </div>

          <div class="ctrl-row">
            <label for="color">Colour</label>
            <div class="swatches">
              <div class="color-picker-wrap" title="Custom color picker">
                <input id="color" type="color" value="#6366f1" aria-label="Custom color picker">
              </div>
              <button type="button" class="swatch active" style="background:#6366f1" data-color="#6366f1" aria-label="Select indigo color"></button>
              <button type="button" class="swatch" style="background:#10b981" data-color="#10b981" aria-label="Select emerald color"></button>
              <button type="button" class="swatch" style="background:#0ea5e9" data-color="#0ea5e9" aria-label="Select sky color"></button>
              <button type="button" class="swatch" style="background:#8b5cf6" data-color="#8b5cf6" aria-label="Select violet color"></button>
              <button type="button" class="swatch" style="background:#f43f5e" data-color="#f43f5e" aria-label="Select rose color"></button>
              <button type="button" class="swatch" style="background:#f59e0b" data-color="#f59e0b" aria-label="Select amber color"></button>
            </div>
            <output id="contrast-badge" class="contrast-badge contrast-good" title="WCAG 2.2 Relative Contrast Ratio" aria-label="WCAG 2.2 Relative Contrast Ratio">4.5:1 AA</output>
            <label for="secondary-color">Secondary</label>
            <div class="swatches">
              <div class="color-picker-wrap" title="Secondary accent color picker">
                <input id="secondary-color" type="color" value="#a855f7" aria-label="Secondary accent color picker">
              </div>
              <button type="button" class="swatch-sec active" style="background:#a855f7" data-color="#a855f7" aria-label="Select violet accent"></button>
              <button type="button" class="swatch-sec" style="background:#38bdf8" data-color="#38bdf8" aria-label="Select sky accent"></button>
              <button type="button" class="swatch-sec" style="background:#34d399" data-color="#34d399" aria-label="Select emerald accent"></button>
              <button type="button" class="swatch-sec" style="background:#fbbf24" data-color="#fbbf24" aria-label="Select amber accent"></button>
              <button type="button" class="swatch-sec" style="background:#f43f5e" data-color="#f43f5e" aria-label="Select rose accent"></button>
              <button type="button" class="swatch-sec" style="background:#94a3b8" data-color="#94a3b8" aria-label="Select slate accent"></button>
            </div>
            <output></output>
          </div>
        </div>

        <div class="switch-row">
          <label class="switch-label">
            <input id="paused" type="checkbox" aria-label="Toggle pause state">
            <span class="switch-toggle"></span>
            <span>paused</span>
          </label>
          <label class="switch-label">
            <input id="reverse" type="checkbox" aria-label="Toggle reverse animation direction">
            <span class="switch-toggle"></span>
            <span>reverse</span>
          </label>
          <label class="switch-label">
            <input id="dark" type="checkbox" aria-label="Toggle dark surface theme">
            <span class="switch-toggle"></span>
            <span>dark surface</span>
          </label>
        </div>

        <!-- Generated Code Box -->
        <div class="code-panel">
          <div class="code-header">
            <span id="code-framework-label">Generated Code</span>
            <button type="button" id="copy" class="btn-copy-code">Copy Code</button>
          </div>
          <pre id="code" tabindex="0" aria-label="Generated component code" aria-live="polite"></pre>
        </div>
      </div>
    </div>
  </section>

  <!-- Showcase Gallery (${totalCount} Loaders) -->
  <main id="showcase" class="showcase-section" aria-label="Component Showcase">
    <div class="section-headline">
      <h2>Component Showcase</h2>
      <p>Explore all ${totalCount} distinct loader designs across ${Object.keys(categoryCounts).length} categories with live GPU-accelerated rendering.</p>
    </div>

    <!-- Sticky Top Filter Bar -->
    <div class="filter-bar">
      <div class="filter-row-top">
        <div class="search-wrapper">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="search" type="search" placeholder="Search ${totalCount} loaders by name or category..." aria-label="Search loaders">
        </div>
        <div class="canvas-modes" aria-label="Filter by dimension">
          <button type="button" class="mode-btn active dim-tab" data-dim="">All</button>
          <button type="button" class="mode-btn dim-tab" data-dim="2d">2D</button>
          <button type="button" class="mode-btn dim-tab" data-dim="3d">3D</button>
        </div>
        <span id="filter-count" class="filter-count">Showing ${totalCount} loaders</span>
      </div>

      <div class="category-tabs" aria-label="Filter by category">
        <button type="button" class="cat-tab active" data-cat="">All (${totalCount})</button>
        <button type="button" class="cat-tab" data-cat="spinner">Spinners (${categoryCounts.spinner || 0})</button>
        <button type="button" class="cat-tab" data-cat="dots">Dots (${categoryCounts.dots || 0})</button>
        <button type="button" class="cat-tab" data-cat="bars">Bars (${categoryCounts.bars || 0})</button>
        <button type="button" class="cat-tab" data-cat="progress">Progress (${categoryCounts.progress || 0})</button>
        <button type="button" class="cat-tab" data-cat="creative">Creative (${categoryCounts.creative || 0})</button>
        <button type="button" class="cat-tab" data-cat="ai">AI & Stream (${categoryCounts.ai || 0})</button>
        <button type="button" class="cat-tab" data-cat="skeleton">Skeletons (${categoryCounts.skeleton || 0})</button>
        <button type="button" class="cat-tab" data-cat="application">App States (${categoryCounts.application || 0})</button>
      </div>

      <select id="category" aria-label="Filter by category" hidden>
        <option value="">All categories</option>
        <option value="spinner">spinner</option>
        <option value="dots">dots</option>
        <option value="bars">bars</option>
        <option value="progress">progress</option>
        <option value="creative">creative</option>
        <option value="ai">ai</option>
        <option value="skeleton">skeleton</option>
        <option value="application">application</option>
      </select>
      <select id="dimension" aria-label="Filter by dimension" hidden>
        <option value="">All dimensions</option>
        <option value="2d">2d</option>
        <option value="3d">3d</option>
      </select>
    </div>

    <!-- Cards Grid -->
    <section class="grid" aria-label="Loader gallery">${cards}</section>
  </main>
</div>

<!-- API Info Modal -->
<div id="api-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
  <div class="modal-card">
    <div class="modal-header">
      <div>
        <h2 id="modal-title" class="modal-headline">Loader API</h2>
        <span id="modal-subtitle" class="modal-sub">Component Specification</span>
      </div>
      <button type="button" id="close-modal" class="modal-close-btn" aria-label="Close API dialog">✕</button>
    </div>
    <div id="modal-content" class="modal-body"></div>
  </div>
</div>

<!-- Floating Framework Copy Popover -->
<div id="copy-popover" class="copy-popover" role="menu" aria-label="Select framework to copy" hidden>
  <div class="copy-popover-header">
    <span class="copy-popover-title">Copy Code</span>
    <span class="copy-popover-target" id="popover-target-name">React</span>
  </div>
  <div class="copy-popover-list">
    <button type="button" class="popover-item" data-fw="html" role="menuitem">
      <span class="popover-fw-badge">HTML</span>
      <span class="popover-fw-name">HTML &amp; CSS</span>
      <span class="popover-fw-tag">&lt;div&gt; + CSS</span>
    </button>
    <button type="button" class="popover-item" data-fw="react" role="menuitem">
      <span class="popover-fw-badge">React</span>
      <span class="popover-fw-name">React JSX</span>
      <span class="popover-fw-tag">&lt;Wavelo /&gt;</span>
    </button>
    <button type="button" class="popover-item" data-fw="vue" role="menuitem">
      <span class="popover-fw-badge">Vue</span>
      <span class="popover-fw-name">Vue SFC</span>
      <span class="popover-fw-tag">&lt;Wavelo /&gt;</span>
    </button>
    <button type="button" class="popover-item" data-fw="svelte" role="menuitem">
      <span class="popover-fw-badge">Svelte</span>
      <span class="popover-fw-name">Svelte 5</span>
      <span class="popover-fw-tag">&lt;Wavelo /&gt;</span>
    </button>
    <button type="button" class="popover-item" data-fw="angular" role="menuitem">
      <span class="popover-fw-badge">Angular</span>
      <span class="popover-fw-name">Angular HTML</span>
      <span class="popover-fw-tag">&lt;wavelo-loader /&gt;</span>
    </button>
    <button type="button" class="popover-item" data-fw="web-components" role="menuitem">
      <span class="popover-fw-badge">WC</span>
      <span class="popover-fw-name">Web Component</span>
      <span class="popover-fw-tag">&lt;wavelo-loader&gt;</span>
    </button>
    <button type="button" class="popover-item" data-fw="vanilla" role="menuitem">
      <span class="popover-fw-badge">JS</span>
      <span class="popover-fw-name">Vanilla JS</span>
      <span class="popover-fw-tag">mountWavelo</span>
    </button>
    <button type="button" class="popover-item" data-fw="core" role="menuitem">
      <span class="popover-fw-badge">Core</span>
      <span class="popover-fw-name">Core Library</span>
      <span class="popover-fw-tag">renderLoader</span>
    </button>
  </div>
</div>

<!-- Toast notification -->
<div id="toast" class="toast" role="status" aria-live="polite">Copied to clipboard!</div>

<footer class="site-footer">
  <div class="footer-links">
    <a href="https://github.com/princegoel0/wavelo" target="_blank" rel="noopener">GitHub</a>
    <a href="https://github.com/princegoel0/wavelo/blob/main/docs/FRAMEWORKS.md" target="_blank" rel="noopener">Frameworks</a>
    <a href="https://github.com/princegoel0/wavelo/blob/main/docs/COMPATIBILITY.md" target="_blank" rel="noopener">Compatibility</a>
    <a href="https://github.com/princegoel0/wavelo/blob/main/LICENSE" target="_blank" rel="noopener">MIT License</a>
  </div>
  <p>© 2026 Wavelo Authors. Built with precision for modern frontend developers.</p>
</footer>

<script>
const stage = document.querySelector('#stage');
const code = document.querySelector('#code');
const design = document.querySelector('#design');
const framework = document.querySelector('#framework');
const stageDesignName = document.querySelector('#stage-design-name');
const stageSpecBadge = document.querySelector('#stage-spec-badge');
const codeFrameworkLabel = document.querySelector('#code-framework-label');

const fields = ['size', 'stroke', 'duration', 'progress', 'color', 'radius', 'count', 'secondary-color'];
const checks = ['paused', 'reverse', 'dark'];
const STATEFUL_DESIGNS = new Set(['save-indicator', 'success-ring', 'error-shake', 'offline-dot', 'button-confirm']);
const determinate = new Set(${JSON.stringify(loaderRegistry.filter((loader) => loader.supportsProgress).map((loader) => loader.id))});
const loaderData = ${JSON.stringify(loaderRegistry.map((l) => ({
  id: l.id,
  name: l.name,
  description: l.description,
  category: l.category,
  dimension: l.dimension,
  supportsProgress: l.supportsProgress,
  options: l.id === 'constellation' ? ['data-wavelo-constellation', ...l.options] : ['save-indicator', 'success-ring', 'error-shake', 'offline-dot', 'button-confirm'].includes(l.id) ? ['data-wavelo-state', ...l.options] : l.options,
  deprecated: l.deprecated,
  aliasOf: l.aliasOf,
  // Honoured studio controls — directly derived from Chromium render measurement
  honoursStroke: l.options.includes('strokeWidth'),
  honoursDuration: l.options.includes('duration'),
  honoursPaused: l.options.includes('paused'),
  honoursReverse: l.options.includes('direction'),
  honoursSize: l.options.includes('size'),
  honoursValue: l.options.includes('value'),
  honoursCount: l.options.includes('count'),
  honoursSecondaryColor: l.options.includes('secondaryColor'),
  honoursRadius: ['ai-shimmer', 'breathing', 'clock-spinner', 'drag-drop-pulse', 'error-shake', 'fullscreen', 'heartbeat', 'helix', 'metronome', 'overlay', 'page-skeleton', 'progress-ai-generate', 'progress-battery', 'progress-multi-step', 'progress-steps', 'progress-upload', 'progress-upload-multi', 'progress-wave-fill', 'segmented-bar', 'skeleton-calendar', 'skeleton-card', 'skeleton-cart', 'skeleton-chart-bar', 'skeleton-chart-donut', 'skeleton-chart-line', 'skeleton-chat', 'skeleton-code', 'skeleton-command', 'skeleton-dashboard', 'skeleton-data-table', 'skeleton-feed', 'skeleton-filter-panel', 'skeleton-inbox', 'skeleton-kanban', 'skeleton-line', 'skeleton-map', 'skeleton-metric', 'skeleton-notification', 'skeleton-product-card', 'skeleton-product-page', 'skeleton-review', 'skeleton-sidebar', 'skeleton-table', 'skeleton-timeline', 'snake', 'stream-cursor', 'toast-loading', 'token-stream', 'undo-progress'].includes(l.id)
})))};

const optionDetails = {
  'data-wavelo-constellation': { type: "'ursa-major' | 'orion' | 'cassiopeia' | 'cygnus' | 'ursa-minor'", def: "'ursa-major'", desc: 'Astronomical star pattern: Big Dipper, Orion, Cassiopeia, Cygnus, Little Dipper' },
  'data-wavelo-state': { type: "'loading' | 'success' | 'error' | 'idle'", def: "'loading'", desc: 'Interaction state for morphing save indicators, success rings, and error shakes' },
  size: { type: 'number | string', def: '48', desc: 'Overall diameter or width in pixels or CSS units' },
  color: { type: 'string', def: 'currentColor', desc: 'Primary fill or SVG stroke colour' },
  secondaryColor: { type: 'string', def: 'transparent', desc: 'Secondary accent, outer ring, or track contrast colour' },
  backgroundColor: { type: 'string', def: 'transparent', desc: 'Container, track background, or skeleton base fill' },
  strokeWidth: { type: 'number | string', def: '3', desc: 'Border width or SVG stroke thickness in pixels' },
  duration: { type: 'string | number', def: '1s', desc: 'Full animation cycle duration (e.g. "1.2s")' },
  radius: { type: 'number | string', def: '6', desc: 'Corner radius for rounded geometries and skeleton blocks' },
  speed: { type: 'number | string', def: '1', desc: 'Animation speed multiplier' },
  direction: { type: "'normal' | 'reverse'", def: "'normal'", desc: 'Animation playback sweep direction' },
  paused: { type: 'boolean', def: 'false', desc: 'Freezes animation playback while maintaining rendered state' },
  theme: { type: "'light' | 'dark' | 'system'", def: "'light'", desc: 'Theme palette for skeletons, overlays, and shimmer' },
  value: { type: 'number', def: '0', desc: 'Current progress value between 0 and max (determinate)' },
  max: { type: 'number', def: '100', desc: 'Maximum progress range value' },
  loading: { type: 'boolean', def: 'true', desc: 'Renders element when true; emits nothing when false' },
  count: { type: 'number (1-12)', def: '3', desc: 'Number of repeated tracks, bars, or skeleton lines' },
  inline: { type: 'boolean', def: 'false', desc: 'Aligns loader inline with text baseline' },
  label: { type: 'string', def: 'undefined', desc: 'Accessible name announced to screen readers (role="status")' },
  labelledBy: { type: 'string', def: 'undefined', desc: 'ID of an element on the page acting as aria-labelledby' },
  describedBy: { type: 'string', def: 'undefined', desc: 'ID of an element acting as aria-describedby' },
  valueText: { type: 'string', def: 'undefined', desc: 'Human-readable progress speech string (aria-valuetext)' },
  decorative: { type: 'boolean', def: 'false', desc: 'Hides loader from accessibility tree (aria-hidden="true")' },
  reducedMotion: { type: "'auto' | 'always' | 'never'", def: "'auto'", desc: 'Reduced-motion accessibility policy' },
  width: { type: 'number | string', def: "'100%'", desc: 'Explicit element or track width in pixels or CSS units' },
  height: { type: 'number | string', def: "'auto'", desc: 'Explicit element or track height in pixels or CSS units' },
  className: { type: 'string', def: 'undefined', desc: 'Custom CSS class names appended to loader container' },
  style: { type: 'CSSProperties', def: 'undefined', desc: 'Custom inline CSS styles or --wavelo-* tokens' },
  'data-testid': { type: 'string', def: 'undefined', desc: 'Automated testing selector attribute' }
};

let activeContext = 'isolated';

function showToast(msg) {
  const t = document.querySelector('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function read() {
  const values = {};
  for (const name of fields) values[name] = document.querySelector('#' + name).value;
  for (const name of checks) values[name] = document.querySelector('#' + name).checked;
  return values;
}

function hexToRgb(hex) {
  let c = (hex || '#6366f1').replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = Number.parseInt(c, 16);
  if (Number.isNaN(num)) return [99, 102, 241];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(rgb) {
  const [rs, gs, bs] = rgb.map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(colorHex, bgHex) {
  const l1 = relativeLuminance(hexToRgb(colorHex));
  const l2 = relativeLuminance(hexToRgb(bgHex));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function generateCodeSnippet(id, fw, values) {
  if (!values) values = read();
  const info = loaderData.find((l) => l.id === id) || {
    name: id,
    dimension: '2d',
    category: 'general',
    honoursStroke: true,
    honoursDuration: true,
    honoursPaused: true,
    honoursReverse: true,
    honoursSize: true,
    honoursValue: false,
    honoursCount: false,
    honoursSecondaryColor: false,
    honoursRadius: false
  };

  const config = {
    type: id
  };
  if (info.honoursSize) config.size = Number(values.size);
  if (info.honoursStroke) config.strokeWidth = Number(values.stroke);
  if (info.honoursDuration) config.duration = values.duration + 's';
  if (info.honoursCount && values.count) config.count = Number(values.count);
  config.color = values.color;
  if (info.honoursSecondaryColor && values['secondary-color']) {
    config.secondaryColor = values['secondary-color'];
  }
  config.theme = values.dark ? 'dark' : 'light';
  if (info.honoursRadius && values.radius && values.radius !== '6') {
    config.style = { '--wavelo-radius': values.radius + 'px' };
  }
  const vSelect = document.querySelector('#variant-select');
  const sSelect = document.querySelector('#state-select');
  if (id === 'constellation' && vSelect && vSelect.value !== 'ursa-major') {
    config['data-wavelo-constellation'] = vSelect.value;
  }
  if (STATEFUL_DESIGNS.has(id) && sSelect && sSelect.value !== 'loading') {
    config['data-wavelo-state'] = sSelect.value;
  }
  if (info.honoursPaused && values.paused) config.paused = true;
  if (info.honoursReverse && values.reverse) config.direction = 'reverse';
  if (determinate.has(id)) config.value = Number(values.progress);

  const extraAttr = id === 'constellation' && vSelect && vSelect.value !== 'ursa-major'
    ? ' data-wavelo-constellation="' + vSelect.value + '"'
    : STATEFUL_DESIGNS.has(id) && sSelect && sSelect.value !== 'loading'
    ? ' data-wavelo-state="' + sSelect.value + '"'
    : '';

  let snippet = '';
  if (fw === 'react') {
    let props = '  type="' + id + '"';
    if (extraAttr) props += '\\n ' + extraAttr.trim();
    if (info.honoursSize) props += '\\n  size={' + values.size + '}';
    if (info.honoursStroke) props += '\\n  strokeWidth={' + values.stroke + '}';
    if (info.honoursDuration) props += '\\n  duration="' + values.duration + 's"';
    if (info.honoursCount) props += '\\n  count={' + values.count + '}';
    props += '\\n  color="' + values.color + '"';
    if (info.honoursSecondaryColor && values['secondary-color']) {
      props += '\\n  secondaryColor="' + values['secondary-color'] + '"';
    }
    if (values.dark) props += '\\n  theme="dark"';
    if (info.honoursPaused && values.paused) props += '\\n  paused';
    if (info.honoursReverse && values.reverse) props += '\\n  direction="reverse"';
    if (determinate.has(id)) props += '\\n  value={' + values.progress + '}';
    if (info.honoursRadius && values.radius && values.radius !== '6') {
      props += '\\n  style={{ \\x27--wavelo-radius\\x27: \\x27' + values.radius + 'px\\x27 }}';
    }
    snippet = "import { Wavelo } from '@wavelo/react';\\n\\n<Wavelo\\n" + props + "\\n/>";
    if (id === 'constellation' && vSelect && vSelect.value !== 'ursa-major') {
      snippet += "\\n\\n// Shortcut preset type:\\n// <Wavelo type='constellation-" + vSelect.value + "' size={" + values.size + "} />";
    }
  } else if (fw === 'vue') {
    let props = '  type="' + id + '"';
    if (extraAttr) props += '\\n ' + extraAttr.trim();
    if (info.honoursSize) props += '\\n  :size="' + values.size + '"';
    if (info.honoursStroke) props += '\\n  :stroke-width="' + values.stroke + '"';
    if (info.honoursDuration) props += '\\n  duration="' + values.duration + 's"';
    if (info.honoursCount) props += '\\n  :count="' + values.count + '"';
    props += '\\n  color="' + values.color + '"';
    if (info.honoursSecondaryColor && values['secondary-color']) {
      props += '\\n  secondary-color="' + values['secondary-color'] + '"';
    }
    if (values.dark) props += '\\n  theme="dark"';
    if (info.honoursPaused && values.paused) props += '\\n  paused';
    if (info.honoursReverse && values.reverse) props += '\\n  direction="reverse"';
    if (determinate.has(id)) props += '\\n  :value="' + values.progress + '"';
    if (info.honoursRadius && values.radius && values.radius !== '6') {
      props += '\\n  :style="{ \\x27--wavelo-radius\\x27: \\x27' + values.radius + 'px\\x27 }"';
    }
    snippet = "<sc" + "ript setup>\\nimport { Wavelo } from '@wavelo/vue';\\n</sc" + "ript>\\n\\n<template>\\n  <Wavelo\\n" + props + "\\n  />\\n</template>";
  } else if (fw === 'svelte') {
    let props = '  type="' + id + '"';
    if (extraAttr) props += '\\n ' + extraAttr.trim();
    if (info.honoursSize) props += '\\n  size={' + values.size + '}';
    if (info.honoursStroke) props += '\\n  strokeWidth={' + values.stroke + '}';
    if (info.honoursDuration) props += '\\n  duration="' + values.duration + 's"';
    if (info.honoursCount) props += '\\n  count={' + values.count + '}';
    props += '\\n  color="' + values.color + '"';
    if (info.honoursSecondaryColor && values['secondary-color']) {
      props += '\\n  secondaryColor="' + values['secondary-color'] + '"';
    }
    if (values.dark) props += '\\n  theme="dark"';
    if (info.honoursPaused && values.paused) props += '\\n  paused';
    if (info.honoursReverse && values.reverse) props += '\\n  direction="reverse"';
    if (determinate.has(id)) props += '\\n  value={' + values.progress + '}';
    if (info.honoursRadius && values.radius && values.radius !== '6') {
      props += '\\n  style="--wavelo-radius: ' + values.radius + 'px"';
    }
    snippet = "<sc" + "ript>\\n  import Wavelo from '@wavelo/svelte/Wavelo.svelte';\\n</sc" + "ript>\\n\\n<Wavelo\\n" + props + "\\n/>";
  } else if (fw === 'angular') {
    let props = '  type="' + id + '"';
    if (extraAttr) props += '\\n ' + extraAttr.trim();
    if (info.honoursSize) props += '\\n  [size]="' + values.size + '"';
    if (info.honoursStroke) props += '\\n  [strokeWidth]="' + values.stroke + '"';
    if (info.honoursDuration) props += '\\n  duration="' + values.duration + 's"';
    if (info.honoursCount) props += '\\n  [count]="' + values.count + '"';
    props += '\\n  color="' + values.color + '"';
    if (info.honoursSecondaryColor && values['secondary-color']) {
      props += '\\n  secondaryColor="' + values['secondary-color'] + '"';
    }
    if (values.dark) props += '\\n  theme="dark"';
    if (info.honoursPaused && values.paused) props += '\\n  [paused]="true"';
    if (info.honoursReverse && values.reverse) props += '\\n  direction="reverse"';
    if (determinate.has(id)) props += '\\n  [value]="' + values.progress + '"';
    if (info.honoursRadius && values.radius && values.radius !== '6') {
      props += '\\n  style="--wavelo-radius: ' + values.radius + 'px"';
    }
    snippet = "<!-- Standalone component: imports: [LoaderComponent] from '@wavelo/angular' -->\\n<wavelo-loader\\n" + props + "\\n/>";
  } else if (fw === 'web-components') {
    let props = '  type="' + id + '"';
    if (extraAttr) props += '\\n ' + extraAttr.trim();
    if (info.honoursSize) props += '\\n  size="' + values.size + '"';
    if (info.honoursStroke) props += '\\n  stroke-width="' + values.stroke + '"';
    if (info.honoursDuration) props += '\\n  duration="' + values.duration + 's"';
    if (info.honoursCount) props += '\\n  count="' + values.count + '"';
    props += '\\n  color="' + values.color + '"';
    if (info.honoursSecondaryColor && values['secondary-color']) {
      props += '\\n  secondary-color="' + values['secondary-color'] + '"';
    }
    if (values.dark) props += '\\n  theme="dark"';
    if (info.honoursPaused && values.paused) props += '\\n  paused';
    if (info.honoursReverse && values.reverse) props += '\\n  direction="reverse"';
    if (determinate.has(id)) props += '\\n  value="' + values.progress + '"';
    if (info.honoursRadius && values.radius && values.radius !== '6') {
      props += '\\n  style="--wavelo-radius: ' + values.radius + 'px"';
    }
    snippet = '<sc' + 'ript type="module">\\n  import { defineWaveloElements } from \\x27@wavelo/web-components\\x27;\\n  defineWaveloElements();\\n</sc' + 'ript>\\n\\n<wavelo-loader\\n' + props + '\\n></wavelo-loader>';
  } else if (fw === 'html') {
    const rendered = renderLoader(config);
    snippet = '<!-- Accessible Standalone HTML & CSS (Zero Dependencies) -->\\n' +
      '<div role="status" aria-live="polite">\\n' +
      '  ' + rendered.html + '\\n' +
      '  <span style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">Loading...</span>\\n' +
      '</div>\\n\\n' +
      '<!-- Scoped Loader Stylesheet & Motion Accessibility Fallback -->\\n' +
      '<style>\\n' +
      rendered.css + '\\n\\n' +
      '@media (prefers-reduced-motion: reduce) {\\n' +
      '  .wavelo, .wavelo * {\\n' +
      '    animation-duration: 0.01ms !important;\\n' +
      '    animation-iteration-count: 1 !important;\\n' +
      '  }\\n' +
      '}\\n' +
      '</style>';
  } else if (fw === 'vanilla') {
    snippet = "import { mountWavelo } from '@wavelo/vanilla';\\n\\nconst detach = mountWavelo(document.querySelector('#slot'), " + JSON.stringify(config, null, 2) + ");";
  } else {
    snippet = "renderLoader(" + JSON.stringify(config, null, 2) + ")";
    if (id === 'constellation' && vSelect && vSelect.value !== 'ursa-major') {
      snippet += "\\n\\n// Or using the named preset shortcut:\\nrenderLoader({\\n  type: 'constellation-" + vSelect.value + "',\\n  size: " + values.size + ",\\n  color: '" + values.color + "'\\n})";
    }
  }
  return snippet;
}

function paint() {
  const id = design.value;
  const values = read();
  const info = loaderData.find((l) => l.id === id) || { name: id, dimension: '2d', category: 'general', honoursStroke: true, honoursDuration: true, honoursPaused: true, honoursReverse: true, honoursSize: true, honoursValue: false, honoursCount: false, honoursSecondaryColor: false, honoursRadius: false };
  
  const rowVariant = document.querySelector('#row-variant');
  const variantSelect = document.querySelector('#variant-select');
  const rowState = document.querySelector('#row-state');
  const stateSelect = document.querySelector('#state-select');

  if (rowVariant) rowVariant.hidden = id !== 'constellation';
  if (rowState) rowState.hidden = !STATEFUL_DESIGNS.has(id);

  // --- Adaptive Controls: show/hide each row based on per-design honoured options ---
  // Row IDs correspond to the control they govern
  const rowStroke = document.querySelector('#stroke').closest('.ctrl-row');
  const rowDuration = document.querySelector('#duration').closest('.ctrl-row');
  const rowPreset = document.querySelector('.preset-segments').closest('.ctrl-row');
  const rowSize = document.querySelector('#size').closest('.ctrl-row');
  const rowRadius = document.querySelector('#radius').closest('.ctrl-row');
  const rowCount = document.querySelector('#row-count');
  const rowSecondary = document.querySelector('#row-secondary-color');
  const rowProgress = document.querySelector('#row-progress');
  const labelPaused = document.querySelector('#paused').closest('.switch-label');
  const labelReverse = document.querySelector('#reverse').closest('.switch-label');

  if (rowStroke) rowStroke.hidden = !info.honoursStroke;
  if (rowDuration) rowDuration.hidden = !info.honoursDuration;
  // Size slider and size presets are linked — hide both or neither
  if (rowSize) rowSize.hidden = !info.honoursSize;
  if (rowPreset) rowPreset.hidden = !info.honoursSize;
  if (rowRadius) rowRadius.hidden = !info.honoursRadius;
  if (rowCount) rowCount.hidden = !info.honoursCount;
  if (rowSecondary) rowSecondary.hidden = !info.honoursSecondaryColor;
  if (rowProgress) rowProgress.hidden = !determinate.has(id);
  if (labelPaused) labelPaused.hidden = !info.honoursPaused;
  if (labelReverse) labelReverse.hidden = !info.honoursReverse;

  if (stageDesignName) stageDesignName.textContent = info.name;
  const stageDesignId = document.querySelector('#stage-design-id');
  if (stageDesignId) stageDesignId.textContent = "type: '" + id + "'";
  if (stageSpecBadge) {
    let specText = info.dimension === '3d' ? '3D (Drag to Orbit)' : info.dimension.toUpperCase();
    if (id === 'constellation' && variantSelect) {
      specText += ' · ' + variantSelect.options[variantSelect.selectedIndex].text.split(' (')[0];
    } else if (STATEFUL_DESIGNS.has(id) && stateSelect) {
      specText += ' · ' + stateSelect.value;
    }
    if (info.honoursSize) specText += ' · ' + values.size + 'px';
    if (info.honoursStroke) specText += ' · ' + values.stroke + 'px';
    if (info.honoursDuration) specText += ' · ' + values.duration + 's';
    if (info.honoursCount) specText += ' · ' + (values.count || 3) + '×';
    if (determinate.has(id)) specText += ' · ' + values.progress + '%';
    stageSpecBadge.textContent = specText;
  }

  const stageBg = values.dark ? '#030712' : '#ffffff';
  const contrastRatio = getContrastRatio(values.color, stageBg);
  const contrastLabel = contrastRatio >= 7.0 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : 'Low';
  const contrastBadge = document.querySelector('#contrast-badge');
  if (contrastBadge) {
    contrastBadge.textContent = contrastRatio.toFixed(1) + ':1 ' + contrastLabel;
    contrastBadge.className = 'contrast-badge ' + (contrastRatio >= 4.5 ? 'contrast-good' : 'contrast-warn');
  }
  const stageContrastPill = document.querySelector('#stage-contrast-pill');
  if (stageContrastPill) {
    stageContrastPill.textContent = 'WCAG ' + contrastRatio.toFixed(1) + ':1 (' + contrastLabel + ')';
    stageContrastPill.className = 'stage-pill pill-contrast ' + (contrastRatio >= 4.5 ? 'pill-good' : 'pill-warn');
  }

  const source = document.querySelector('.card[data-id="' + id + '"] .wavelo');
  if (!source) return;
  const rendered = source.cloneNode(true);
  rendered.setAttribute('data-wavelo-theme', values.dark ? 'dark' : 'light');

  if (id === 'constellation' && variantSelect) {
    rendered.setAttribute('data-wavelo-constellation', variantSelect.value);
  } else if (STATEFUL_DESIGNS.has(id) && stateSelect) {
    rendered.setAttribute('data-wavelo-state', stateSelect.value);
  }

  // Countable designs: dynamically re-render child parts based on count slider
  if (info.honoursCount) {
    const countVal = Number(values.count || 3);
    const parts = Array.from({ length: countVal }, () => {
      const p = document.createElement('span');
      p.className = 'wavelo__part';
      p.setAttribute('aria-hidden', 'true');
      return p;
    });
    rendered.replaceChildren(...parts);
    if (id === 'skeleton-line') {
      rendered.classList.toggle('wavelo-stacked', countVal > 1);
    }
  }

  // Render according to context
  if (activeContext === 'button') {
    const btn = document.createElement('div');
    btn.className = 'mock-btn';
    btn.append(rendered, document.createTextNode(' Processing...'));
    stage.replaceChildren(btn);
  } else if (activeContext === 'card') {
    const card = document.createElement('div');
    card.className = 'mock-card';
    const lines = document.createElement('div');
    lines.className = 'mock-card-lines';
    lines.innerHTML = '<div class="mock-line"></div><div class="mock-line short"></div>';
    card.append(rendered, lines);
    stage.replaceChildren(card);
  } else if (activeContext === 'table') {
    const table = document.createElement('div');
    table.className = 'mock-table';
    table.innerHTML = '<div class="mock-row"><span>#1042 · Payout</span><span class="slot"></span><span class="status-text">In Progress</span></div>';
    table.querySelector('.slot').replaceChildren(rendered);
    stage.replaceChildren(table);
  } else {
    stage.replaceChildren(rendered);
  }

  const tokens = {
    '--wavelo-size': values.size + 'px',
    '--wavelo-color': values.color,
    '--wavelo-play-state': values.paused ? 'paused' : 'running',
    '--wavelo-direction': values.reverse ? 'reverse' : 'normal'
  };
  if (info.honoursStroke) tokens['--wavelo-stroke'] = values.stroke + 'px';
  if (info.honoursDuration) tokens['--wavelo-duration'] = values.duration + 's';
  if (info.honoursRadius) tokens['--wavelo-radius'] = values.radius + 'px';
  if (info.honoursSecondaryColor && values['secondary-color']) tokens['--wavelo-secondary-color'] = values['secondary-color'];
  if (info.honoursCount) {
    tokens['--wavelo-parts'] = String(values.count || 3);
    tokens['--wavelo-count'] = String(values.count || 3);
  }

  const progress = document.querySelector('#progress');
  progress.disabled = !determinate.has(id);
  progress.closest('.ctrl-row').querySelector('output').textContent = values.progress + '%';
  if (determinate.has(id)) tokens['--wavelo-progress'] = values.progress + '%';

  for (const [token, value] of Object.entries(tokens)) stage.style.setProperty(token, value);
  for (const name of fields.filter((field) => field !== 'progress')) {
    const output = document.querySelector('output[for="' + name + '"]');
    if (output) {
      if (name === 'duration') output.textContent = values.duration + 's';
      else if (name === 'color') output.textContent = values.color;
      else if (name === 'secondary-color') output.textContent = values['secondary-color'];
      else if (name === 'count') {
        const c = values.count || 3;
        output.textContent = id === 'skeleton-line' ? c + (c === '1' ? ' line' : ' lines') : id.includes('dots') ? c + ' dots' : c + ' tracks';
      } else output.textContent = values[name] + 'px';
    }
  }

  const fw = framework.value;
  if (codeFrameworkLabel) {
    const labels = { core: 'Core (@wavelo/core)', react: 'React JSX', vue: 'Vue SFC', svelte: 'Svelte 5', angular: 'Angular HTML', vanilla: 'Vanilla JS DOM', 'web-components': 'Web Component' };
    codeFrameworkLabel.textContent = 'Code snippet (' + (labels[fw] || fw) + ')';
  }

  code.textContent = generateCodeSnippet(id, fw, values);

  try {
    const hashParams = new URLSearchParams({
      type: id,
      framework: fw,
      size: values.size,
      color: values.color
    });
    if (values.dark) hashParams.set('dark', '1');
    if (values.paused) hashParams.set('paused', '1');
    if (determinate.has(id)) hashParams.set('value', values.progress);
    if (info.honoursCount && values.count) hashParams.set('count', values.count);
    if (info.honoursSecondaryColor && values['secondary-color']) hashParams.set('secondaryColor', values['secondary-color']);
    if (id === 'constellation' && variantSelect) hashParams.set('pattern', variantSelect.value);
    if (STATEFUL_DESIGNS.has(id) && stateSelect) hashParams.set('state', stateSelect.value);
    window.history.replaceState(null, '', '#' + hashParams.toString());
  } catch (e) {}
}

for (const el of document.querySelectorAll('#design, #framework, .controls-column input, .controls-column select')) {
  el.addEventListener('input', paint);
  el.addEventListener('change', paint);
}

// Framework tabs
document.querySelectorAll('.fw-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.fw-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    framework.value = tab.dataset.fw;
    paint();
  });
});

// Size presets
document.querySelectorAll('.preset-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector('#size').value = btn.dataset.size;
    paint();
  });
});

// Color swatches
document.querySelectorAll('.swatch').forEach((sw) => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
    sw.classList.add('active');
    document.querySelector('#color').value = sw.dataset.color;
    paint();
  });
});

// Sync color input changes back to swatches
document.querySelector('#color').addEventListener('input', (e) => {
  const chosen = e.target.value.toLowerCase();
  document.querySelectorAll('.swatch').forEach((s) => {
    s.classList.toggle('active', s.dataset.color.toLowerCase() === chosen);
  });
});

// Secondary color swatches
document.querySelectorAll('.swatch-sec').forEach((sw) => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.swatch-sec').forEach((s) => s.classList.remove('active'));
    sw.classList.add('active');
    document.querySelector('#secondary-color').value = sw.dataset.color;
    paint();
  });
});

// Sync secondary color input changes back to swatches
document.querySelector('#secondary-color').addEventListener('input', (e) => {
  const chosen = e.target.value.toLowerCase();
  document.querySelectorAll('.swatch-sec').forEach((s) => {
    s.classList.toggle('active', s.dataset.color.toLowerCase() === chosen);
  });
});

// Stage background modes
document.querySelectorAll('.canvas-modes [data-bg]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.canvas-modes [data-bg]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    stage.classList.remove('stage-dark', 'stage-dim', 'stage-light', 'stage-black', 'stage-brand');
    stage.classList.add('stage-' + btn.dataset.bg);
  });
});

// Simulated UI Context modes
document.querySelectorAll('.canvas-modes [data-ctx]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.canvas-modes [data-ctx]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeContext = btn.dataset.ctx;
    paint();
  });
});

// 3D Interactive Stage Orbit & Tilt
const stageWrapper = document.querySelector('.stage-wrapper');
if (stageWrapper) {
  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  stageWrapper.addEventListener('pointerdown', (e) => {
    const currentId = design.value;
    const currentInfo = loaderData.find((l) => l.id === currentId);
    if (!currentInfo || currentInfo.dimension !== '3d') return;
    isPointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
    try { stageWrapper.setPointerCapture(e.pointerId); } catch (_) {}
  });

  stageWrapper.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    currentTiltY = Math.max(-45, Math.min(45, currentTiltY + dx * 0.4));
    currentTiltX = Math.max(-45, Math.min(45, currentTiltX - dy * 0.4));
    startX = e.clientX;
    startY = e.clientY;
    const loaderEl = stage.querySelector('.wavelo');
    if (loaderEl) {
      loaderEl.style.transform = 'perspective(500px) rotateX(' + currentTiltX + 'deg) rotateY(' + currentTiltY + 'deg)';
    }
  });

  const resetTilt = (e) => {
    if (isPointerDown) {
      isPointerDown = false;
      try { stageWrapper.releasePointerCapture(e.pointerId); } catch (_) {}
      const loaderEl = stage.querySelector('.wavelo');
      if (loaderEl) {
        loaderEl.style.transition = 'transform 0.4s ease-out';
        loaderEl.style.transform = '';
        setTimeout(() => { if (loaderEl) loaderEl.style.transition = ''; }, 400);
      }
      currentTiltX = 0;
      currentTiltY = 0;
    }
  };

  stageWrapper.addEventListener('pointerup', resetTilt);
  stageWrapper.addEventListener('pointercancel', resetTilt);
}

// Copy code button
document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(code.textContent);
  } catch (err) {}
  const btn = document.querySelector('#copy');
  const oldText = btn.textContent;
  btn.textContent = 'Copied!';
  const fwName = framework.value;
  const fwLabels = { core: '@wavelo/core', react: 'React', vue: 'Vue', svelte: 'Svelte', angular: 'Angular', vanilla: 'Vanilla JS', 'web-components': 'Web Component' };
  showToast('Copied ' + design.value + ' (' + (fwLabels[fwName] || fwName) + ') code to clipboard!');
  setTimeout(() => { btn.textContent = oldText; }, 1500);
});

// Package manager install command tabs
const pkgTabs = document.querySelectorAll('.t-tab');
const installCmd = document.querySelector('#install-cmd');
const copyInstallBtn = document.querySelector('#copy-install');
const copyInstallText = document.querySelector('#copy-install-text');

let activePkg = 'npm';
const installTemplates = {
  npm: 'npm i @wavelo/react',
  pnpm: 'pnpm add @wavelo/react',
  yarn: 'yarn add @wavelo/react',
  bun: 'bun add @wavelo/react'
};

pkgTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    pkgTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    activePkg = tab.dataset.pkg;
    installCmd.textContent = installTemplates[activePkg];
  });
});

copyInstallBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(installCmd.textContent);
  } catch (err) {}
  copyInstallText.textContent = 'Copied!';
  showToast('Copied installation command: ' + installCmd.textContent);
  setTimeout(() => { copyInstallText.textContent = 'Copy'; }, 1500);
});

// Theme Toggle (Dark / Light)
const themeToggle = document.querySelector('#theme-toggle');
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('wavelo-theme', next); } catch (e) {}
});

// Restore saved theme
try {
  const saved = localStorage.getItem('wavelo-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
} catch (e) {}

// Restore from URL hash on load
try {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const params = new URLSearchParams(hash);
    if (params.has('type') && document.querySelector('#design option[value="' + params.get('type') + '"]')) {
      design.value = params.get('type');
    }
    if (params.has('framework') && document.querySelector('#framework option[value="' + params.get('framework') + '"]')) {
      framework.value = params.get('framework');
      document.querySelectorAll('.fw-tab').forEach((t) => {
        t.classList.toggle('active', t.dataset.fw === framework.value);
      });
    }
    if (params.has('size')) document.querySelector('#size').value = params.get('size');
    if (params.has('color')) {
      document.querySelector('#color').value = params.get('color');
      document.querySelectorAll('.swatch').forEach((s) => {
        s.classList.toggle('active', s.dataset.color.toLowerCase() === params.get('color').toLowerCase());
      });
    }
    if (params.has('dark')) document.querySelector('#dark').checked = true;
    if (params.has('paused')) document.querySelector('#paused').checked = true;
    if (params.has('value')) document.querySelector('#progress').value = params.get('value');
    if (params.has('pattern') && document.querySelector('#variant-select option[value="' + params.get('pattern') + '"]')) {
      document.querySelector('#variant-select').value = params.get('pattern');
    }
    if (params.has('state') && document.querySelector('#state-select option[value="' + params.get('state') + '"]')) {
      document.querySelector('#state-select').value = params.get('state');
    }
    if (params.has('count') && document.querySelector('#count')) {
      document.querySelector('#count').value = params.get('count');
    }
    if (params.has('secondaryColor') && document.querySelector('#secondary-color')) {
      document.querySelector('#secondary-color').value = params.get('secondaryColor');
      document.querySelectorAll('.swatch-sec').forEach((s) => {
        s.classList.toggle('active', s.dataset.color.toLowerCase() === params.get('secondaryColor').toLowerCase());
      });
    }
  }
} catch (e) {}

paint();

// Card Action Handlers
document.querySelectorAll('.card').forEach((card) => {
  const cardId = card.dataset.id;
  
  // Click card body to test in studio
  card.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    if (cardId && document.querySelector('#design option[value="' + cardId + '"]')) {
      design.value = cardId;
      paint();
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Action buttons
  const btnTest = card.querySelector('.btn-test-card');
  if (btnTest) {
    btnTest.addEventListener('click', (e) => {
      e.stopPropagation();
      design.value = cardId;
      paint();
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  const btnCopy = card.querySelector('.btn-copy-card');
  if (btnCopy) {
    btnCopy.addEventListener('mouseenter', () => {
      openCopyPopover(btnCopy, cardId);
    });
    btnCopy.addEventListener('mouseleave', () => {
      scheduleCloseCopyPopover(220);
    });
    btnCopy.addEventListener('focus', () => {
      openCopyPopover(btnCopy, cardId);
    });
    btnCopy.addEventListener('blur', () => {
      scheduleCloseCopyPopover(220);
    });
    btnCopy.addEventListener('click', (e) => {
      e.stopPropagation();
      openCopyPopover(btnCopy, cardId);
    });
  }

  const btnInfo = card.querySelector('.btn-info-card');
  if (btnInfo) {
    btnInfo.addEventListener('click', (e) => {
      e.stopPropagation();
      openApiModal(cardId);
    });
  }

  // Copy design ID button
  const btnCopyId = card.querySelector('.btn-copy-id');
  if (btnCopyId) {
    btnCopyId.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(cardId);
      } catch (err) {}
      btnCopyId.classList.add('copied');
      const codeEl = btnCopyId.querySelector('.meta-code');
      const orig = codeEl ? codeEl.textContent : '';
      if (codeEl) codeEl.textContent = '✓ Copied ID!';
      showToast('Copied design ID: "' + cardId + '" to clipboard!');
      setTimeout(() => {
        btnCopyId.classList.remove('copied');
        if (codeEl) codeEl.textContent = orig;
      }, 1200);
    });
  }

  // Quick color swatch dots on card
  card.querySelectorAll('.quick-dot').forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      card.querySelectorAll('.quick-dot').forEach((d) => d.classList.remove('active'));
      dot.classList.add('active');
      const dotColor = dot.dataset.color;
      const loaderEl = card.querySelector('.wavelo');
      if (loaderEl) {
        loaderEl.style.setProperty('--wavelo-color', dotColor);
        loaderEl.style.setProperty('color', dotColor);
      }
    });
  });
});

// Copy Stage Design ID in Studio
const btnCopyStageId = document.querySelector('#btn-copy-stage-id');
if (btnCopyStageId) {
  btnCopyStageId.addEventListener('click', async () => {
    const id = design.value;
    try {
      await navigator.clipboard.writeText(id);
    } catch (err) {}
    btnCopyStageId.classList.add('copied');
    const codeEl = btnCopyStageId.querySelector('code');
    const orig = codeEl ? codeEl.textContent : '';
    if (codeEl) codeEl.textContent = '✓ Copied ID!';
    showToast('Copied design ID: "' + id + '" to clipboard!');
    setTimeout(() => {
      btnCopyStageId.classList.remove('copied');
      if (codeEl) codeEl.textContent = orig;
    }, 1200);
  });
}

// Copy Framework Popover Controller
const copyPopover = document.querySelector('#copy-popover');
const popoverTargetName = document.querySelector('#popover-target-name');
let activeCopyTargetId = null;
let popoverCloseTimer = null;
let activeCopyTrigger = null;

function positionCopyPopover(trigger) {
  if (!trigger || !copyPopover) return;
  const rect = trigger.getBoundingClientRect();
  const popoverWidth = 290;
  const popoverHeight = copyPopover.offsetHeight || 335;
  
  // Try placing above trigger first (with 8px gap)
  let top = rect.top - popoverHeight - 8;
  if (top < 10) {
    // If not enough room above, place below trigger
    top = rect.bottom + 8;
  }
  
  let left = rect.left + (rect.width / 2) - (popoverWidth / 2);
  // Clamp within viewport horizontally with 10px margin
  if (left < 10) left = 10;
  if (left + popoverWidth > window.innerWidth - 10) {
    left = window.innerWidth - popoverWidth - 10;
  }
  
  copyPopover.style.top = top + 'px';
  copyPopover.style.left = left + 'px';
}

function openCopyPopover(trigger, targetId) {
  clearTimeout(popoverCloseTimer);
  activeCopyTargetId = targetId;
  activeCopyTrigger = trigger;
  const info = loaderData.find((l) => l.id === targetId);
  if (popoverTargetName) {
    popoverTargetName.textContent = info ? info.name : targetId;
  }
  trigger.setAttribute('aria-expanded', 'true');
  copyPopover.removeAttribute('hidden');
  positionCopyPopover(trigger);
}

function scheduleCloseCopyPopover(delay = 220) {
  clearTimeout(popoverCloseTimer);
  popoverCloseTimer = setTimeout(() => {
    closeCopyPopover();
  }, delay);
}

function closeCopyPopover() {
  clearTimeout(popoverCloseTimer);
  if (copyPopover) {
    copyPopover.setAttribute('hidden', '');
  }
  if (activeCopyTrigger) {
    activeCopyTrigger.setAttribute('aria-expanded', 'false');
  }
  activeCopyTargetId = null;
  activeCopyTrigger = null;
}

if (copyPopover) {
  copyPopover.addEventListener('mouseenter', () => {
    clearTimeout(popoverCloseTimer);
  });
  copyPopover.addEventListener('mouseleave', () => {
    scheduleCloseCopyPopover(200);
  });
}

document.addEventListener('click', (e) => {
  if (copyPopover && !copyPopover.hidden) {
    if (!copyPopover.contains(e.target) && (!activeCopyTrigger || !activeCopyTrigger.contains(e.target))) {
      closeCopyPopover();
    }
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && copyPopover && !copyPopover.hidden) {
    const trigger = activeCopyTrigger;
    closeCopyPopover();
    if (trigger) trigger.focus();
  }
});

window.addEventListener('scroll', () => {
  if (copyPopover && !copyPopover.hidden && activeCopyTrigger) {
    const rect = activeCopyTrigger.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      closeCopyPopover();
    } else {
      positionCopyPopover(activeCopyTrigger);
    }
  }
}, { passive: true });

document.querySelectorAll('.copy-popover .popover-item').forEach((item) => {
  item.addEventListener('click', async (e) => {
    e.stopPropagation();
    const fw = item.dataset.fw;
    const targetId = activeCopyTargetId;
    if (!targetId) return;

    const snippet = generateCodeSnippet(targetId, fw);
    try {
      await navigator.clipboard.writeText(snippet);
    } catch (err) {}

    const nameEl = item.querySelector('.popover-fw-name');
    const originalName = nameEl ? nameEl.textContent : '';
    if (nameEl) nameEl.textContent = '✓ Copied!';
    item.classList.add('copied');

    const fwLabels = {
      html: 'HTML & CSS',
      core: '@wavelo/core',
      react: 'React',
      vue: 'Vue',
      svelte: 'Svelte',
      angular: 'Angular',
      vanilla: 'Vanilla JS',
      'web-components': 'Web Component'
    };
    const targetInfo = loaderData.find((l) => l.id === targetId);
    showToast('Copied ' + (targetInfo ? targetInfo.name : targetId) + ' (' + (fwLabels[fw] || fw) + ') code to clipboard!');

    setTimeout(() => {
      if (nameEl) nameEl.textContent = originalName;
      item.classList.remove('copied');
      closeCopyPopover();
    }, 400);
  });
});

// Modal Logic
const modal = document.querySelector('#api-modal');
const modalTitle = document.querySelector('#modal-title');
const modalSub = document.querySelector('#modal-subtitle');
const modalContent = document.querySelector('#modal-content');
const closeModal = document.querySelector('#close-modal');

function openApiModal(id) {
  const info = loaderData.find((l) => l.id === id);
  if (!info) return;
  modalTitle.textContent = info.name;
  modalSub.textContent = info.description;
  
  let content = '<div class="modal-meta-pills">';
  content += '<span class="modal-pill">Category: ' + info.category + '</span>';
  content += '<span class="modal-pill">Dimension: ' + info.dimension.toUpperCase() + '</span>';
  content += '<button type="button" class="modal-pill modal-pill-btn btn-copy-modal-id" data-id="' + info.id + '" title="Copy design ID: ' + info.id + '">ID: <code>' + info.id + '</code> <svg class="copy-id-icon" aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>';
  if (info.supportsProgress) content += '<span class="modal-pill" style="color:var(--accent)">Determinate Progress</span>';
  if (id === 'constellation') content += '<span class="modal-pill badge-feat">5 Astronomical Formations</span>';
  if (STATEFUL_DESIGNS.has(id)) content += '<span class="modal-pill" style="color:var(--accent)">Morphing States</span>';
  content += '</div>';

  content += '<div class="modal-snippet-section">';
  content += '<div class="modal-snippet-header">';
  content += '<h4 style="margin:0;font-size:0.86rem;font-weight:700;color:var(--text-main)">Ready-to-Paste Code Snippet</h4>';
  content += '<button type="button" class="btn-copy-modal-snippet" id="btn-copy-modal-code"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Code</button>';
  content += '</div>';
  content += '<div class="modal-fw-tabs" role="tablist" aria-label="Framework code formats">';
  content += '<button type="button" class="modal-fw-tab active" data-mfw="react">React</button>';
  content += '<button type="button" class="modal-fw-tab" data-mfw="vue">Vue</button>';
  content += '<button type="button" class="modal-fw-tab" data-mfw="svelte">Svelte</button>';
  content += '<button type="button" class="modal-fw-tab" data-mfw="angular">Angular</button>';
  content += '<button type="button" class="modal-fw-tab" data-mfw="vanilla">Vanilla</button>';
  content += '<button type="button" class="modal-fw-tab" data-mfw="web-components">Web Comp</button>';
  content += '<button type="button" class="modal-fw-tab" data-mfw="html">HTML &amp; CSS</button>';
  content += '</div>';
  content += '<pre class="modal-code-sample" id="modal-code-display">' + generateCodeSnippet(id, 'react', read()).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
  content += '</div>';

  if (id === 'constellation') {
    content += '<div class="modal-doc-box">';
    content += '<div class="modal-doc-title"><span>🌌 Astronomical Formations (5 Celestial Patterns)</span><span class="badge badge-feat">Click to Test in Studio</span></div>';
    content += '<p class="modal-doc-desc">The <code>constellation</code> loader renders authentic astronomical star formations using GPU-accelerated CSS and celestial coordinates with polygon line vertices. Click any formation below to load and preview it directly in the Live Studio workbench:</p>';
    content += '<div class="pattern-chips">';
    content += '<button type="button" class="pattern-chip" data-pattern="ursa-major" aria-label="Test Ursa Major in Studio"><span class="pattern-chip-name"><span>🐻 Ursa Major</span><span class="badge badge-dim">Default</span></span><span class="pattern-chip-code">ursa-major</span><span class="pattern-chip-desc">7 stars · The Great Bear &amp; Big Dipper</span></button>';
    content += '<button type="button" class="pattern-chip" data-pattern="orion" aria-label="Test Orion in Studio"><span class="pattern-chip-name"><span>🏹 Orion</span><span class="badge badge-dim">7 Stars</span></span><span class="pattern-chip-code">orion</span><span class="pattern-chip-desc">Betelgeuse (orange), Rigel (blue) &amp; 3-star belt</span></button>';
    content += '<button type="button" class="pattern-chip" data-pattern="cassiopeia" aria-label="Test Cassiopeia in Studio"><span class="pattern-chip-name"><span>👑 Cassiopeia</span><span class="badge badge-dim">5 Stars</span></span><span class="pattern-chip-code">cassiopeia</span><span class="pattern-chip-desc">Distinctive W-shaped celestial throne</span></button>';
    content += '<button type="button" class="pattern-chip" data-pattern="cygnus" aria-label="Test Cygnus in Studio"><span class="pattern-chip-name"><span>🦢 Cygnus</span><span class="badge badge-dim">5 Stars</span></span><span class="pattern-chip-code">cygnus</span><span class="pattern-chip-desc">The Swan &amp; Northern Cross formation</span></button>';
    content += '<button type="button" class="pattern-chip" data-pattern="ursa-minor" aria-label="Test Ursa Minor in Studio"><span class="pattern-chip-name"><span>🧭 Ursa Minor</span><span class="badge badge-dim">7 Stars</span></span><span class="pattern-chip-code">ursa-minor</span><span class="pattern-chip-desc">Little Dipper anchored by the North Star Polaris</span></button>';
    content += '</div>';

    content += '<div style="margin-top:0.35rem">';
    content += '<h4 style="font-size:0.82rem;font-weight:700;margin:0 0 0.4rem;color:var(--text-main)">How to Switch Constellation Patterns in Your Application:</h4>';
    content += '<p style="font-size:0.78rem;color:var(--text-muted);margin:0 0 0.35rem;font-weight:600">Option A: Named Preset Alias (Recommended &amp; Type-Safe):</p>';
    content += '<pre class="modal-code-sample">// React JSX\\nimport { Loader } from \\x27@wavelo/react\\x27;\\n\\n&lt;Loader type="constellation-orion" size={48} color="#6366f1" /&gt;\\n&lt;Loader type="constellation-cassiopeia" size={48} /&gt;</pre>';
    content += '<p style="font-size:0.78rem;color:var(--text-muted);margin:0.6rem 0 0.35rem;font-weight:600">Option B: Data Attribute (Multi-Framework):</p>';
    content += '<pre class="modal-code-sample">&lt;!-- React --&gt;\\n&lt;Loader type="constellation" data-wavelo-constellation="orion" /&gt;\\n\\n&lt;!-- Vue SFC --&gt;\\n&lt;Loader type="constellation" data-wavelo-constellation="cassiopeia" /&gt;\\n\\n&lt;!-- Svelte 5 --&gt;\\n&lt;WaveloLoader type="constellation" data-wavelo-constellation="cygnus" /&gt;\\n\\n&lt;!-- Angular --&gt;\\n&lt;wavelo-loader type="constellation" data-wavelo-constellation="ursa-minor" /&gt;\\n\\n&lt;!-- Vanilla JS / Core --&gt;\\nrenderLoader({ type: \\x27constellation\\x27, \\x27data-wavelo-constellation\\x27: \\x27orion\\x27 });</pre>';
    content += '</div></div>';
  } else if (STATEFUL_DESIGNS.has(id)) {
    content += '<div class="modal-doc-box">';
    content += '<div class="modal-doc-title"><span>⚡ Interactive State Lifecycle (Stateful Morphing)</span><span class="badge badge-cat">Interactive State</span></div>';
    content += '<p class="modal-doc-desc">This component smoothly morphs between interaction states using <code>data-wavelo-state</code> without re-mounting or layout shifts:</p>';
    content += '<div class="pattern-chips">';
    content += '<div class="pattern-chip"><span class="pattern-chip-name"><span>🔄 loading</span></span><span class="pattern-chip-code">data-wavelo-state="loading"</span><span class="pattern-chip-desc">Active spinning or pulsing animation</span></div>';
    content += '<div class="pattern-chip"><span class="pattern-chip-name"><span>✅ success</span></span><span class="pattern-chip-code">data-wavelo-state="success"</span><span class="pattern-chip-desc">Smooth transition into verified checkmark</span></div>';
    content += '<div class="pattern-chip"><span class="pattern-chip-name"><span>⚠️ error</span></span><span class="pattern-chip-code">data-wavelo-state="error"</span><span class="pattern-chip-desc">Attention shake and failure alert indicator</span></div>';
    content += '<div class="pattern-chip"><span class="pattern-chip-name"><span>⏸️ idle</span></span><span class="pattern-chip-code">data-wavelo-state="idle"</span><span class="pattern-chip-desc">Standby or dimmed non-blocking state</span></div>';
    content += '</div>';
    content += '<div style="margin-top:0.35rem"><h4 style="font-size:0.82rem;font-weight:700;margin:0 0 0.4rem;color:var(--text-main)">Async Operation Lifecycle Example:</h4>';
    content += '<pre class="modal-code-sample">// React state transition example\\nconst [saveState, setSaveState] = useState&lt;\\x27loading\\x27 | \\x27success\\x27 | \\x27error\\x27 | \\x27idle\\x27&gt;(\\x27idle\\x27);\\n\\nasync function handleSave() {\\n  setSaveState(\\x27loading\\x27);\\n  try {\\n    await api.saveDocument();\\n    setSaveState(\\x27success\\x27);\\n  } catch (err) {\\n    setSaveState(\\x27error\\x27);\\n  }\\n}\\n\\nreturn &lt;Loader type="' + id + '" data-wavelo-state={saveState} size={32} /&gt;;</pre>';
    content += '</div></div>';
  } else if (info.dimension === '3d') {
    content += '<div class="modal-doc-box">';
    content += '<div class="modal-doc-title"><span>🧊 Spatial 3D Volumetric Motion</span><span class="badge badge-dim">Hardware Accelerated</span></div>';
    content += '<p class="modal-doc-desc">This component operates in true 3D spatial coordinate space using <code>transform-style: preserve-3d</code>, <code>perspective</code>, and <code>translateZ</code> / <code>rotateX/Y</code> keyframes. Animations execute entirely on the browser GPU compositor thread with 0 layout recalculations.</p>';
    content += '<pre class="modal-code-sample">// React JSX\\nimport { Loader } from \\x27@wavelo/react\\x27;\\n\\n&lt;Loader type="' + id + '" size={64} color="#38bdf8" secondaryColor="#ec4899" /&gt;</pre>';
    content += '</div>';
  }

  content += '<div><h3 style="margin:1rem 0 .5rem;font-size:.92rem;font-weight:700">Supported Configuration Options</h3><table class="modal-table"><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>';
  for (const opt of info.options) {
    const d = optionDetails[opt] || { type: 'string', def: '—', desc: 'Custom property honoured by ' + info.name };
    content += '<tr><td><code>' + opt + '</code></td><td><code>' + d.type + '</code></td><td><code>' + d.def + '</code></td><td>' + d.desc + '</td></tr>';
  }
  content += '</tbody></table></div>';
  content += '<div><h3 style="margin:1rem 0 .4rem;font-size:.92rem;font-weight:700">Accessibility & ARIA Contract</h3><p style="color:var(--text-muted);margin:0;line-height:1.6">When given a <code>label</code> or <code>labelledBy</code>, renders <code>role="' + (info.supportsProgress ? 'progressbar' : 'status') + '"</code>. Unlabelled instances render <code>aria-hidden="true"</code> to keep assistive technology quiet. Reduced motion preferences are automatically honoured without layout shifts.</p></div>';

  modalContent.innerHTML = content;

  // Framework tabs inside API modal
  let activeModalFw = 'react';
  const modalCodeDisplay = modalContent.querySelector('#modal-code-display');
  const modalCodeBtn = modalContent.querySelector('#btn-copy-modal-code');

  modalContent.querySelectorAll('.modal-fw-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      modalContent.querySelectorAll('.modal-fw-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activeModalFw = tab.dataset.mfw;
      if (modalCodeDisplay) {
        modalCodeDisplay.textContent = generateCodeSnippet(id, activeModalFw, read());
      }
    });
  });

  if (modalCodeBtn) {
    modalCodeBtn.addEventListener('click', async () => {
      const snippet = generateCodeSnippet(id, activeModalFw, read());
      try {
        await navigator.clipboard.writeText(snippet);
      } catch (err) {}
      modalCodeBtn.classList.add('copied');
      modalCodeBtn.textContent = '✓ Copied!';
      showToast('Copied ' + activeModalFw.toUpperCase() + ' snippet to clipboard!');
      setTimeout(() => {
        modalCodeBtn.classList.remove('copied');
        modalCodeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Code';
      }, 1400);
    });
  }

  // Bind copy design ID button in modal
  const modalCopyId = modalContent.querySelector('.btn-copy-modal-id');
  if (modalCopyId) {
    modalCopyId.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(info.id);
      } catch (err) {}
      modalCopyId.classList.add('copied');
      showToast('Copied design ID: "' + info.id + '" to clipboard!');
      setTimeout(() => modalCopyId.classList.remove('copied'), 1200);
    });
  }

  // Bind pattern chips inside modal to live preview
  modalContent.querySelectorAll('.pattern-chip[data-pattern]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const p = chip.dataset.pattern;
      modal.hidden = true;
      design.value = 'constellation';
      const variantSel = document.querySelector('#variant-select');
      if (variantSel) variantSel.value = p;
      paint();
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Loaded ' + p + ' constellation into Studio!');
    });
  });

  modal.hidden = false;
}

closeModal.addEventListener('click', () => { modal.hidden = true; });
modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) modal.hidden = true; });

// Filter & Search
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const dimension = document.querySelector('#dimension');
const filterCount = document.querySelector('#filter-count');

function filter() {
  const q = search.value.toLowerCase().trim();
  const catVal = category.value;
  const dimVal = dimension.value;
  let visible = 0;

  document.querySelectorAll('.card').forEach((c) => {
    const matchesQuery = !q || c.dataset.name.includes(q) || c.dataset.id.includes(q) || c.dataset.category.includes(q);
    const matchesCat = !catVal || c.dataset.category === catVal;
    const matchesDim = !dimVal || c.dataset.dimension === dimVal;
    const show = matchesQuery && matchesCat && matchesDim;
    if (show) {
      c.removeAttribute('hidden');
      c.style.display = '';
      visible++;
    } else {
      c.setAttribute('hidden', '');
      c.style.display = 'none';
    }
  });
  filterCount.textContent = 'Showing ' + visible + ' of ' + cards.length + ' loaders';
}

search.addEventListener('input', filter);
search.addEventListener('search', filter);

// Category tabs
document.querySelectorAll('.cat-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    category.value = tab.dataset.cat;
    filter();
  });
});

// Dimension tabs
document.querySelectorAll('.dim-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dim-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    dimension.value = tab.dataset.dim;
    filter();
  });
});
</script></body></html>`;

console.log(html);
