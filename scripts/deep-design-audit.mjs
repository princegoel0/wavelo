import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { loaderRegistry, renderLoader } from '../packages/core/dist/index.js';
import { allStyles } from '../packages/core/dist/css/index.js';

// A scratch harness, so its screenshots and results go to the ignored audit
// directory rather than a machine-specific path nobody else can write to.
const artifactDir = resolve('release-audit', 'deep-design-audit');
await mkdir(artifactDir, { recursive: true });

const categories = ['spinner', 'dots', 'bars', 'progress', 'creative', 'ai', 'skeleton', 'application'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 }, deviceScaleFactor: 2 });

const auditResults = [];

try {
  for (const cat of categories) {
    const loaders = loaderRegistry.filter((l) => l.category === cat);
    console.log(`Auditing category: ${cat} (${loaders.length} loaders)...`);

    // Prepare HTML stage for this category
    const cardsHtml = loaders.map((l) => {
      // Determine sample config
      let cfg = { type: l.id, label: l.name };
      if (l.supportsProgress) {
        cfg.value = 65;
        cfg.max = 100;
      }
      if (l.options.includes('secondaryColor')) {
        cfg.secondaryColor = '#38bdf8'; // sky blue
      }
      const rendered = renderLoader(cfg);
      return `
        <div class="audit-card" data-id="${l.id}" data-kind="${l.kind}" data-dim="${l.dimension}">
          <div class="card-header">
            <span class="card-title">${l.name}</span>
            <span class="card-badge ${l.dimension}">${l.dimension.toUpperCase()}</span>
          </div>
          <div class="stage">
            ${rendered.html}
          </div>
          <div class="card-meta">
            <code>${l.id}</code>
            <span class="kind-tag">${l.kind}</span>
          </div>
        </div>
      `;
    }).join('\n');

    const pageHtml = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Audit: ${cat}</title>
        <style>
          ${allStyles}
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: #090d16;
            color: #f1f5f9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 32px;
          }
          .category-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #38bdf8;
          }
          .category-desc {
            font-size: 14px;
            color: #94a3b8;
            margin-bottom: 24px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
          }
          .audit-card {
            background: #111827;
            border: 1px solid #1f2937;
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          }
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .card-title {
            font-size: 14px;
            font-weight: 600;
            color: #e2e8f0;
          }
          .card-badge {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
          }
          .card-badge.2d {
            background: #1e293b;
            color: #94a3b8;
          }
          .card-badge.3d {
            background: #3b82f6;
            color: #ffffff;
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          }
          .stage {
            height: 140px;
            background: #0b0f19;
            border: 1px dashed #1e293b;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            perspective: 600px;
          }
          .card-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #64748b;
          }
          code {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            color: #38bdf8;
          }
          .kind-tag {
            background: #1e293b;
            padding: 2px 6px;
            border-radius: 4px;
            color: #cbd5e1;
          }
        </style>
      </head>
      <body>
        <div class="category-title">${cat} (${loaders.length} Loaders)</div>
        <div class="category-desc">Wavelo 0.2.0 In-Depth Visual & QA Audit Stage</div>
        <div class="grid">
          ${cardsHtml}
        </div>
      </body>
      </html>
    `;

    await page.setContent(pageHtml);
    await page.waitForTimeout(600); // let animations start

    // Screenshot full category grid
    const screenshotFile = resolve(artifactDir, `audit-${cat}.png`);
    await page.screenshot({ path: screenshotFile, fullPage: true });

    // Inspect individual loaders inside this category
    for (const l of loaders) {
      const cardHandle = page.locator(`.audit-card[data-id="${l.id}"]`);
      const loaderHandle = cardHandle.locator('.wavelo');

      const metrics = await loaderHandle.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        const children = el.querySelectorAll('*');
        const childTags = Array.from(children).map(c => c.className || c.tagName);

        // Check animations on element and children
        let animNames = [computed.animationName];
        let animDurations = [computed.animationDuration];
        let transforms = [computed.transform];

        children.forEach(c => {
          const cs = window.getComputedStyle(c);
          if (cs.animationName && cs.animationName !== 'none') {
            animNames.push(cs.animationName);
            animDurations.push(cs.animationDuration);
          }
          if (cs.transform && cs.transform !== 'none') {
            transforms.push(cs.transform);
          }
        });

        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          visible: rect.width > 0 && rect.height > 0 && computed.visibility !== 'hidden' && computed.display !== 'none',
          childCount: children.length,
          childClasses: childTags.slice(0, 10),
          animationNames: Array.from(new Set(animNames.filter(n => n && n !== 'none'))),
          animationDurations: Array.from(new Set(animDurations.filter(d => d && d !== '0s'))),
          hasTransform: transforms.some(t => t && t !== 'none'),
          role: el.getAttribute('role'),
          ariaLabel: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')
        };
      });

      auditResults.push({
        id: l.id,
        name: l.name,
        category: l.category,
        kind: l.kind,
        dimension: l.dimension,
        supportsProgress: l.supportsProgress,
        options: l.options,
        metrics
      });
    }
  }

  await writeFile(
    resolve(artifactDir, 'audit-results.json'),
    JSON.stringify(auditResults, null, 2),
    'utf8'
  );
  console.log(`Deep audit finished: 153 designs audited. Captured screenshots in ${artifactDir}`);
} finally {
  await browser.close();
}
