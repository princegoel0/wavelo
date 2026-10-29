import { loaderRegistry, renderLoader } from '@wavelo/core';
import { allStyles } from '@wavelo/core/css';
import { stylesheetMarkup } from '@wavelo/core/styles';

/** Which controls a design can respond to, from the options measured against it. */
const cards = loaderRegistry.map((loader) => `
<article class="card${loader.deprecated ? ' deprecated' : ''}" data-category="${loader.category}" data-id="${loader.id}" data-name="${loader.name.toLowerCase()}" data-deprecated="${loader.deprecated ? 'true' : 'false'}">
  <div class="preview">${renderLoader({ type: loader.id }).html}</div>
  <h2>${loader.name}${loader.deprecated ? ' <small>deprecated alias</small>' : ''}</h2><p>${loader.description}${loader.aliasOf ? ` Use <code>${loader.aliasOf}</code> for the canonical design.` : ''}</p>
  <code>type: '${loader.id}'</code>
  <ul class="options" aria-label="${loader.name} options">${loader.options
    .filter((option) => option !== 'label' && option !== 'className' && option !== 'style' && option !== 'data-testid' && option !== 'reducedMotion' && option !== 'loading')
    .map((option) => `<li>${option}</li>`).join('')}</ul>
</article>`).join('');

const optionNames = [...new Set(loaderRegistry.flatMap((loader) => loader.options))].sort();
const designs = loaderRegistry.map((loader) => `<option value="${loader.id}">${loader.name}</option>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Wavelo — Motion made simple</title>
<style>
:root{font-family:system-ui,sans-serif;color:#172033;background:#f7f8fb}body{max-width:1180px;margin:auto;padding:2rem}header{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:2rem}.lede{max-width:52rem;color:#596579}.controls{display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1.5rem}input,select{padding:.65rem;border:1px solid #ccd3df;border-radius:.5rem;background:white}input[type=color]{height:2.3rem;padding:.15rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1rem}.card{background:white;border:1px solid #e2e6ef;border-radius:.75rem;padding:1rem;box-shadow:0 2px 8px #1720330b}.preview{height:6rem;display:grid;place-items:center;overflow:hidden;background:linear-gradient(135deg,#f3f5ff,#fff)}.preview .wavelo--fullscreen{position:relative;inset:auto;width:100%;height:100%;min-width:0;min-height:0}.preview .wavelo--progress-top{position:relative;top:auto;left:auto;width:100%}.card h2{font-size:1rem;margin-bottom:.3rem}.card p{font-size:.875rem;color:#596579;min-height:2.5rem}.card code{font-size:.75rem;color:#5b4acb}
.options{display:flex;flex-wrap:wrap;gap:.25rem;padding:0;margin:.6rem 0 0;list-style:none}.options li{font:500 .68rem/1.6 ui-monospace,monospace;color:#4a5568;background:#eef1f8;border-radius:.35rem;padding:.05rem .4rem}
.playground{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:1.25rem;background:white;border:1px solid #e2e6ef;border-radius:.75rem;padding:1.25rem;margin-bottom:2rem}.playground h2{font-size:1.1rem;margin:0 0 .3rem}.playground .stage{display:grid;place-items:center;min-height:11rem;border-radius:.5rem;background:linear-gradient(135deg,#f3f5ff,#fff);overflow:hidden}.playground .stage.dark-stage{background:#111827}.panel{display:grid;gap:.55rem}.field{display:grid;grid-template-columns:7.5rem minmax(0,1fr) 3.5rem;align-items:center;gap:.5rem;font-size:.8rem}.field label{font-weight:600}.field output{font-variant-numeric:tabular-nums;color:#596579;text-align:right}.check{display:flex;gap:1.2rem;flex-wrap:wrap;font-size:.85rem}.check label{display:flex;gap:.35rem;align-items:center}pre{margin:0;padding:.75rem;background:#0f172a;color:#e2e8f0;border-radius:.5rem;font-size:.75rem;overflow:auto;white-space:pre-wrap}small.note{display:block;color:#596579;font-size:.78rem;margin:.4rem 0 1.2rem}
@media (max-width:760px){.playground{grid-template-columns:minmax(0,1fr)}}
</style>${stylesheetMarkup(allStyles)}</head><body><header><div><h1>Wavelo</h1><p class="lede">Motion made simple. Accessible, customizable loading experiences for every framework.</p></div><strong>${loaderRegistry.length} designs</strong></header>
<section class="playground" aria-label="Configuration playground">
  <div>
    <div class="stage" id="stage"></div>
    <pre id="code" aria-live="polite"></pre>
  </div>
  <div class="panel">
    <h2>Try the configuration</h2>
    <small class="note">Every control writes a <code>--wavelo-*</code> custom property on the box around the loader, which is exactly how a page sets a house style. The code below is the equivalent configuration object.</small>
    <div class="field"><label for="design">Design</label><select id="design">${designs}</select><output></output></div>
    <div class="field"><label for="size">Size</label><input id="size" type="range" min="16" max="120" step="4" value="48"><output for="size">48px</output></div>
    <div class="field"><label for="stroke">Stroke</label><input id="stroke" type="range" min="1" max="14" step="1" value="3"><output for="stroke">3px</output></div>
    <div class="field"><label for="duration">Duration</label><input id="duration" type="range" min="0.2" max="4" step="0.1" value="1"><output for="duration">1s</output></div>
    <div class="field"><label for="progress">Value</label><input id="progress" type="range" min="0" max="100" step="1" value="35"><output for="progress">n/a</output></div>
    <div class="field"><label for="color">Colour</label><input id="color" type="color" value="#6366f1"><output></output></div>
    <div class="field"><label for="radius">Radius</label><input id="radius" type="range" min="0" max="24" step="1" value="6"><output for="radius">6px</output></div>
    <div class="check">
      <label><input id="paused" type="checkbox"> paused</label>
      <label><input id="reverse" type="checkbox"> reverse</label>
      <label><input id="dark" type="checkbox"> dark surface</label>
    </div>
    <button id="copy" type="button">Copy this configuration</button>
  </div>
</section>
<main><div class="controls"><input id="search" type="search" placeholder="Search loaders" aria-label="Search loaders"><select id="category" aria-label="Filter by category"><option value="">All categories</option>${[...new Set(loaderRegistry.map((loader) => loader.category))].map((category) => `<option>${category}</option>`).join('')}</select></div>
<small class="note">The chips under each design are the options it actually honours, measured in Chromium against its own render by <code>npm run audit:customization</code> — not a list someone wrote. Structural options (label, class, style, data attributes, reduced motion, loading) are left out because every design takes them.</small>
<section class="grid" aria-label="Loader gallery">${cards}</section></main>
<script>
const stage = document.querySelector('#stage');
const code = document.querySelector('#code');
const design = document.querySelector('#design');
const fields = ['size', 'stroke', 'duration', 'progress', 'color', 'radius'];
const checks = ['paused', 'reverse', 'dark'];
const determinate = new Set(${JSON.stringify(loaderRegistry.filter((loader) => loader.supportsProgress).map((loader) => loader.id))});

function read() {
  const values = {};
  for (const name of fields) values[name] = document.querySelector('#' + name).value;
  for (const name of checks) values[name] = document.querySelector('#' + name).checked;
  return values;
}

function paint() {
  const id = design.value;
  const values = read();
  const source = document.querySelector('.card[data-id="' + id + '"] .wavelo');
  const rendered = source.cloneNode(true);
  // The theme rules key off this attribute, so the "dark surface" checkbox drives
  // the same switch a caller makes with the \`theme\` option.
  rendered.setAttribute('data-wavelo-theme', values.dark ? 'dark' : 'light');
  stage.replaceChildren(rendered);
  stage.classList.toggle('dark-stage', values.dark);
  const tokens = {
    '--wavelo-size': values.size + 'px',
    '--wavelo-stroke': values.stroke + 'px',
    '--wavelo-duration': values.duration + 's',
    '--wavelo-color': values.color,
    '--wavelo-radius': values.radius + 'px',
    '--wavelo-play-state': values.paused ? 'paused' : 'running',
    '--wavelo-direction': values.reverse ? 'reverse' : 'normal'
  };
  // The value control only means something to a determinate design, so it says so
  // rather than looking like a slider that does nothing.
  const progress = document.querySelector('#progress');
  progress.disabled = !determinate.has(id);
  progress.closest('.field').querySelector('output').textContent = determinate.has(id) ? values.progress + '%' : 'n/a';
  if (determinate.has(id)) tokens['--wavelo-progress'] = values.progress + '%';
  for (const [token, value] of Object.entries(tokens)) stage.style.setProperty(token, value);
  for (const name of fields.filter((field) => field !== 'progress')) {
    const output = document.querySelector('output[for="' + name + '"]');
    if (output) output.textContent = name === 'duration' ? values.duration + 's' : name === 'color' ? values.color : values[name] + 'px';
  }
  const config = { type: id, size: Number(values.size), strokeWidth: Number(values.stroke), duration: values.duration + 's', color: values.color, theme: values.dark ? 'dark' : 'light', style: { '--wavelo-radius': values.radius + 'px' } };
  if (values.paused) config.paused = true;
  if (values.reverse) config.direction = 'reverse';
  if (determinate.has(id)) config.value = Number(values.progress);
  code.textContent = "renderLoader(" + JSON.stringify(config, null, 2) + ")";
}

for (const element of document.querySelectorAll('#design, .playground input, .playground button')) element.addEventListener('input', paint);
document.querySelector('#copy').addEventListener('click', async () => {
  await navigator.clipboard.writeText(code.textContent);
});
paint();

const search = document.querySelector('#search'), category = document.querySelector('#category');
function filter() {
  const q = search.value.toLowerCase();
  document.querySelectorAll('.card').forEach((c) => { c.hidden = !(c.dataset.name.includes(q) && (!category.value || c.dataset.category === category.value)); });
}
search.addEventListener('input', filter);
category.addEventListener('change', filter);
</script></body></html>`;

console.log(html);
