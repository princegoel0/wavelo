import { chromium } from 'playwright';
import { renderLoader, renderStylesheets } from '../packages/core/dist/index.js';
import { allStyles } from '../packages/core/dist/css/index.js';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });

  const elevatedLoaders = [
    { id: 'atom-orbital', name: 'Atom Orbital', desc: 'True 3D Volumetric Spheres with Specular Pinpricks & Occlusion' },
    { id: 'newton-cradle', name: 'Newton Cradle', desc: 'Mirror Chrome 3D Metallic Spheres with High-Tensile Suspension' },
    { id: 'sphere-lattice', name: 'Sphere Lattice', desc: 'Holographic Geodesic Dyson Sphere with Pulsing Quantum Core' },
    { id: 'quantum-superposition', name: 'Quantum Superposition', desc: '3D Probability Clouds Collapsing into High-Energy Singularity' },
    { id: 'hologram-pyramid', name: 'Hologram Pyramid', desc: 'Translucent Hologram with Laser Scanlines & Pedestal Projector' },
    { id: 'vortex-tunnel', name: 'Vortex Tunnel', desc: 'Relativistic Hyperspace Jump with Doppler Gates & Vanishing Point' },
    { id: 'crystal-cluster', name: 'Crystal Cluster', desc: 'Faceted Quartz Prisms with Specular Caustics & Floating Elevation' },
    { id: 'solar-system', name: 'Solar System', desc: '3D Shaded Celestial Spheres with Saturn Tilted Ring System' }
  ];

  const cardsHtml = elevatedLoaders.map(({ id, name, desc }) => {
    const rendered = renderLoader({ type: id, size: '80px', color: '#38bdf8', secondaryColor: '#ec4899', label: name });
    return `
      <div style="background:#090d16; border:1px solid #1e293b; border-radius:14px; padding:20px; display:flex; flex-direction:column; align-items:center; gap:12px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);">
        <div style="font-size:14px; font-weight:700; color:#f1f5f9; font-family:sans-serif;">${name}</div>
        <div style="width:140px; height:140px; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at center, #111827 0%, #030712 100%); border-radius:10px; border:1px solid #1f2937; position:relative; overflow:hidden;">
          ${rendered.html}
        </div>
        <div style="color:#94a3b8; font-size:11px; text-align:center; height:32px; display:flex; align-items:center; font-family:sans-serif;">${desc}</div>
        <code style="color:#38bdf8; font-size:11px; font-family:monospace; background:#0f172a; padding:4px 8px; border-radius:4px; border:1px solid #1e293b;">${id}</code>
      </div>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        ${renderStylesheets([allStyles])}
        <style>
          body {
            margin: 0;
            padding: 36px;
            background: #030712;
            color: #f8fafc;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.02em;
            background: linear-gradient(to right, #38bdf8, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 6px;
          }
          .subtitle {
            color: #94a3b8;
            font-size: 13px;
            margin-bottom: 28px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(4, 280px);
            gap: 20px;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div class="title">Wavelo Production Visual Elevation — Live Compiled Library</div>
        <div class="subtitle">100% Pure CSS · Hardware-Accelerated 60fps · Zero Dependencies · True 3D Volumetric Spheres</div>
        <div class="grid">
          ${cardsHtml}
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(600);
  const outputPath = 'C:/Users/princ/.gemini/antigravity/brain/f399e054-8521-418d-a0a0-598e2836cf53/production-futuristic-verified.png';
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(`Saved screenshot to ${outputPath}`);
  await browser.close();
}

main().catch(console.error);
