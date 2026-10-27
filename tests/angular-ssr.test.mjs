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
    template: '<wavelo-loader type="ring" label="Loading data"></wavelo-loader>'
  })(class AppComponent {});

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
  assert.doesNotMatch(html, /ReferenceError: (HTMLElement|window|document)/);
});
