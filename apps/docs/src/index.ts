import { loaderRegistry, renderLoader } from '@wavelo/core';
import { allStyles } from '@wavelo/core/css';
import { stylesheetMarkup } from '@wavelo/core/styles';

const cards = loaderRegistry.map((loader) => `
<article class="card${loader.deprecated ? ' deprecated' : ''}" data-category="${loader.category}" data-name="${loader.name.toLowerCase()}" data-deprecated="${loader.deprecated ? 'true' : 'false'}">
  <div class="preview">${renderLoader({ type: loader.id }).html}</div>
  <h2>${loader.name}${loader.deprecated ? ' <small>deprecated alias</small>' : ''}</h2><p>${loader.description}${loader.aliasOf ? ` Use <code>${loader.aliasOf}</code> for the canonical design.` : ''}</p>
  <code>type: '${loader.id}'</code>
</article>`).join('');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Wavelo — Motion made simple</title>
<style>
:root{font-family:system-ui,sans-serif;color:#172033;background:#f7f8fb}body{max-width:1180px;margin:auto;padding:2rem}header{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:2rem}.lede{max-width:52rem;color:#596579}.controls{display:flex;gap:.75rem;flex-wrap:wrap;margin-bottom:1.5rem}input,select{padding:.65rem;border:1px solid #ccd3df;border-radius:.5rem;background:white}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1rem}.card{background:white;border:1px solid #e2e6ef;border-radius:.75rem;padding:1rem;box-shadow:0 2px 8px #1720330b}.preview{height:6rem;display:grid;place-items:center;overflow:hidden;background:linear-gradient(135deg,#f3f5ff,#fff)}.preview .wavelo--fullscreen{position:relative;inset:auto;width:100%;height:100%;min-width:0;min-height:0}.preview .wavelo--progress-top{position:relative;top:auto;left:auto;width:100%}.card h2{font-size:1rem;margin-bottom:.3rem}.card p{font-size:.875rem;color:#596579;min-height:2.5rem}.card code{font-size:.75rem;color:#5b4acb}
</style>${stylesheetMarkup(allStyles)}</head><body><header><div><h1>Wavelo</h1><p class="lede">Motion made simple. Accessible, customizable loading experiences for every framework.</p></div><strong>${loaderRegistry.length} designs</strong></header>
<main><div class="controls"><input id="search" type="search" placeholder="Search loaders" aria-label="Search loaders"><select id="category" aria-label="Filter by category"><option value="">All categories</option>${[...new Set(loaderRegistry.map((loader) => loader.category))].map((category) => `<option>${category}</option>`).join('')}</select><button id="copy">Copy example</button></div>
<section class="grid" aria-label="Loader gallery">${cards}</section></main>
<script>
const search=document.querySelector('#search'),category=document.querySelector('#category');
function filter(){const q=search.value.toLowerCase();document.querySelectorAll('.card').forEach(c=>c.hidden=!(c.dataset.name.includes(q)&&(!category.value||c.dataset.category===category.value)))}
search.addEventListener('input',filter);category.addEventListener('change',filter);
document.querySelector('#copy').addEventListener('click',async()=>{await navigator.clipboard.writeText("import { renderLoader } from '@wavelo/core';\\nrenderLoader({ type: 'orbiting-dots', label: 'Loading' });");});
</script></body></html>`;

console.log(html);
