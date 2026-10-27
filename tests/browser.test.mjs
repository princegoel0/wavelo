import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

test('documentation gallery renders and has no axe violations', async () => {
  const html = await readFile(resolve('apps/docs/dist/index.html'), 'utf8');
  const axe = await readFile(resolve('node_modules/axe-core/axe.min.js'), 'utf8');
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end(html);
  });
  await new Promise((resolveServer) => server.listen(0, resolveServer));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`http://127.0.0.1:${address.port}`);
    assert.equal(await page.locator('.card').count(), 81);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const reducedDuration = await page.locator('.card .wavelo').first().evaluate((element) => getComputedStyle(element).animationDuration);
    assert.ok(Number.parseFloat(reducedDuration) <= 0.000001, `unexpected reduced-motion duration: ${reducedDuration}`);
    await page.addScriptTag({ content: axe });
    const violations = await page.evaluate(async () => (await window.axe.run()).violations);
    assert.deepEqual(violations, []);
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(pageErrors, []);
  } finally {
    await browser.close();
    server.close();
  }
});
