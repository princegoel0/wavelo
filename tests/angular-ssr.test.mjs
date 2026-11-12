import test from 'node:test';
import assert from 'node:assert/strict';

test('Angular server rendering renders Wavelo without browser globals', async () => {
  await import('@angular/compiler');
  const { Component } = await import('@angular/core');
  const { bootstrapApplication } = await import('@angular/platform-browser');
  const { renderApplication } = await import('@angular/platform-server');
  const { LoaderComponent } = await import('../packages/angular/dist/index.js');

  const AppComponent = Component({
    selector: 'app-root',
    standalone: true,
    imports: [LoaderComponent],
    template: '<wavelo-loader type="ring" label="Loading data"></wavelo-loader><wavelo-loader type="brand-loader" [brand]="brand" [value]="50"></wavelo-loader>'
  })(class AppComponent { brand = { text: 'ACME', indicator: 'bar', showValue: true }; });

  const html = await renderApplication(
    (context) => bootstrapApplication(AppComponent, {}, context),
    {
      document: '<!doctype html><html><body><app-root></app-root></body></html>',
      url: 'http://localhost/',
      allowedHosts: ['localhost']
    }
  );

  assert.match(html, /aria-label="Loading data"/);
  assert.match(html, /class="wavelo wavelo--ring/);
  assert.match(html, /aria-label="ACME loading"/);
  assert.match(html, /role="progressbar"/);
  assert.match(html, />50%<\/span>/);
  assert.doesNotMatch(html, /ReferenceError: (HTMLElement|window|document)/);
});
