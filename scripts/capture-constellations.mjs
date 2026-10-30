import { chromium } from 'playwright';
import { renderLoader, renderStylesheets } from '../packages/core/dist/index.js';
import { allStyles } from '../packages/core/dist/css/index.js';
import { mkdir } from 'node:fs/promises';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1250, height: 420 } });

  const constellations = [
    { id: 'constellation-ursa-major', name: 'Ursa Major (Big Dipper)' },
    { id: 'constellation-orion', name: 'Orion (The Hunter)' },
    { id: 'constellation-cassiopeia', name: 'Cassiopeia ("W" Shape)' },
    { id: 'constellation-cygnus', name: 'Cygnus (Northern Cross)' },
    { id: 'constellation-ursa-minor', name: 'Ursa Minor & Polaris' }
  ];

  const renderedList = constellations.map(({ id, name }) => {
    const rendered = renderLoader({ type: id, size: '96px', color: '#60a5fa', label: name });
    return { id, name, html: rendered.html, css: rendered.css };
  });

  const cards = renderedList
    .map(({ id, name, html }) => `
      <div style="background:#090d16; border:1px solid #1e293b; border-radius:12px; padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);">
        <div style="color:#94a3b8; font-size:13px; font-weight:600; font-family:sans-serif; text-align:center;">${name}</div>
        <div style="width:120px; height:120px; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at center, #1e1b4b 0%, #030712 100%); border-radius:8px; border:1px solid #312e81;">
          ${html}
        </div>
        <code style="color:#38bdf8; font-size:11px; font-family:monospace; background:#0f172a; padding:4px 8px; border-radius:4px;">${id.replace('constellation-', '')}</code>
      </div>
    `)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${renderStylesheets([allStyles])}
        <style>
          body {
            margin: 0;
            padding: 32px;
            background: #030712;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          h1 { margin: 0 0 6px 0; font-size: 20px; color: #e2e8f0; }
          p { margin: 0 0 24px 0; color: #94a3b8; font-size: 13px; }
          .grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
            max-width: 1150px;
            width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>Wavelo Astronomical Constellation Suite</h1>
        <p>Authentic astronomical star patterns with connected polygon geometric paths and star glow</p>
        <div class="grid">
          ${cards}
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(600);

  await mkdir('release-audit', { recursive: true });
  await page.screenshot({ path: 'release-audit/constellations.png' });
  await browser.close();
  console.log('Saved release-audit/constellations.png successfully');
}

main().catch(console.error);
