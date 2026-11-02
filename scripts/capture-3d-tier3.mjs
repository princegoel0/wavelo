import { chromium } from 'playwright';
import { renderLoader, renderStylesheets } from '../packages/core/dist/index.js';
import { allStyles } from '../packages/core/dist/css/index.js';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 460 } });

  const designs = [
    { id: 'liquid-mercury', name: 'Liquid Mercury', desc: 'Microgravity Fluid Specular Droplet' },
    { id: 'dna-decode', name: 'DNA Decode', desc: 'Holographic Nucleotide Scanner' },
    { id: 'quantum-superposition', name: 'Quantum Superposition', desc: 'Probability Eigenstate Singularity' },
    { id: 'magnetic-field', name: 'Magnetic Field', desc: 'Toroidal Dipole Field Flux Flow' },
    { id: 'aurora-borealis', name: 'Aurora Borealis', desc: 'Volumetric Undulating Plasma Curtains' }
  ];

  const renderedList = designs.map(({ id, name, desc }) => {
    const rendered = renderLoader({ type: id, size: '80px', color: '#38bdf8', secondaryColor: '#ec4899', label: name });
    return { id, name, desc, html: rendered.html };
  });

  const cards = renderedList
    .map(({ id, name, desc, html }) => `
      <div style="background:#090d16; border:1px solid #1e293b; border-radius:12px; padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.5); width:230px;">
        <div style="color:#f8fafc; font-size:14px; font-weight:700; font-family:sans-serif; text-align:center;">${name}</div>
        <div style="width:140px; height:140px; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at center, #1e1b4b 0%, #030712 100%); border-radius:10px; border:1px solid #312e81;">
          ${html}
        </div>
        <div style="color:#94a3b8; font-size:11px; text-align:center; height:32px; display:flex; align-items:center;">${desc}</div>
        <code style="color:#38bdf8; font-size:11px; font-family:monospace; background:#0f172a; padding:4px 8px; border-radius:4px; border:1px solid #1e293b;">${id}</code>
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
            padding: 28px;
            background: #030712;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .header {
            margin-bottom: 24px;
            text-align: center;
          }
          .title {
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.025em;
            background: linear-gradient(to right, #38bdf8, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .subtitle {
            color: #94a3b8;
            font-size: 12px;
            margin-top: 4px;
          }
          .grid {
            display: flex;
            gap: 16px;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Wavelo 3D Suite — Tier 3 Unprecedented Experimental Simulations</div>
          <div class="subtitle">100% Pure CSS · Zero WebGL Dependencies · Hardware Accelerated 60fps Compositor Motion</div>
        </div>
        <div class="grid">
          ${cards}
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  // Allow animations to advance to 30% phase for dynamic representation
  await page.waitForTimeout(600);

  const outputPath = 'C:/Users/princ/.gemini/antigravity/brain/f399e054-8521-418d-a0a0-598e2836cf53/verified-3d-tier3-cards.png';
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Saved screenshot to ${outputPath}`);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

