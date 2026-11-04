import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { loaderRegistry } from '@wavelo/core';
import { chromium } from 'playwright';

const isUpdate = process.argv.includes('--update-baselines');
const baselineDir = resolve('tests', 'visual-baselines');
const baselinePath = resolve(baselineDir, 'catalog-baselines.json');
const diffDir = resolve('release-audit', 'visual-diffs');

await mkdir(baselineDir, { recursive: true });

const html = await readFile(resolve('apps/docs/dist/index.html'), 'utf8');
const server = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(html);
});
await new Promise((r) => server.listen(0, r));
const address = server.address();
if (!address || typeof address === 'string') {
  throw new Error('Unable to start local gallery server for visual regression');
}

console.log(`Starting visual regression audit for ${loaderRegistry.length} designs in headless Chromium...`);
const startTime = performance.now();

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1
});

try {
  await page.goto(`http://127.0.0.1:${address.port}`, { waitUntil: 'load' });

  // Disable content-visibility so all cards instantiate their geometry immediately
  await page.addStyleTag({
    content: `
      .card { content-visibility: visible !important; }
    `
  });

  // Wake all animations and freeze them deterministically at 250ms
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => requestAnimationFrame(r));
    window.scrollTo(0, 0);
    await new Promise((r) => requestAnimationFrame(r));
    for (const anim of document.getAnimations()) {
      try {
        anim.currentTime = 250;
        anim.pause();
      } catch (_) {}
    }
  });

  const currentResults = {};
  const chunkSize = 10;
  for (let i = 0; i < loaderRegistry.length; i += chunkSize) {
    const chunk = loaderRegistry.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (loader) => {
        const locator = page.locator(`.card[data-id="${loader.id}"] .preview`);
        const buf = await locator.screenshot({ type: 'png' });
        const hash = createHash('sha256').update(buf).digest('hex');
        currentResults[loader.id] = {
          id: loader.id,
          category: loader.category,
          dimension: loader.dimension,
          size: buf.length,
          hash,
          _buffer: buf
        };
      })
    );
  }

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

  if (isUpdate) {
    const serialized = {};
    for (const [id, data] of Object.entries(currentResults)) {
      serialized[id] = {
        id: data.id,
        category: data.category,
        dimension: data.dimension,
        size: data.size,
        hash: data.hash
      };
    }
    await writeFile(baselinePath, JSON.stringify(serialized, null, 2), 'utf8');
    console.log(`✔ Successfully updated golden baselines for ${loaderRegistry.length} designs in ${elapsed}s.`);
    console.log(`Saved: ${baselinePath}`);
    process.exit(0);
  }

  // Verification mode
  let baselineData;
  try {
    baselineData = JSON.parse(await readFile(baselinePath, 'utf8'));
  } catch (err) {
    console.warn(`No existing baseline found at ${baselinePath}. Creating initial baselines now...`);
    const serialized = {};
    for (const [id, data] of Object.entries(currentResults)) {
      serialized[id] = {
        id: data.id,
        category: data.category,
        dimension: data.dimension,
        size: data.size,
        hash: data.hash
      };
    }
    await writeFile(baselinePath, JSON.stringify(serialized, null, 2), 'utf8');
    console.log(`✔ Generated initial golden baselines for ${loaderRegistry.length} designs in ${elapsed}s.`);
    process.exit(0);
  }

  const regressions = [];
  for (const loader of loaderRegistry) {
    const baseline = baselineData[loader.id];
    const current = currentResults[loader.id];
    if (!baseline) {
      regressions.push({ id: loader.id, reason: 'Missing baseline record' });
    } else if (baseline.hash !== current.hash) {
      regressions.push({
        id: loader.id,
        expectedHash: baseline.hash,
        actualHash: current.hash,
        expectedSize: baseline.size,
        actualSize: current.size
      });
      // Save diff screenshot artifact
      await mkdir(diffDir, { recursive: true });
      await writeFile(resolve(diffDir, `${loader.id}-regression.png`), current._buffer);
    }
  }

  if (regressions.length > 0) {
    console.error(`\n❌ Visual regression detected across ${regressions.length} design(s):`);
    for (const reg of regressions) {
      console.error(`  - ${reg.id}: expected hash ${reg.expectedHash?.slice(0, 10)}... got ${reg.actualHash?.slice(0, 10)}... (diff saved to release-audit/visual-diffs/${reg.id}-regression.png)`);
    }
    console.error(`\nIf these visual changes were intentional, update the baselines with:`);
    console.error(`  npm run test:visual:update\n`);
    process.exit(1);
  }

  console.log(`✔ Visual regression audit passed: ${loaderRegistry.length}/${loaderRegistry.length} designs match golden baselines in ${elapsed}s.`);
} finally {
  await browser.close();
  server.close();
}
