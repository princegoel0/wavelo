import test from 'node:test';
import assert from 'node:assert/strict';
import domino from 'domino';

test('Angular TestBed renders, updates, and cleans up the standalone component', async () => {
  const window = domino.createWindow('<!doctype html><html><body></body></html>');
  for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'Event', 'CustomEvent']) {
    globalThis[key] = window[key];
  }
  Object.defineProperty(globalThis, 'navigator', { value: window.navigator, configurable: true });

  await import('@angular/compiler');
  const { TestBed } = await import('@angular/core/testing');
  const { BrowserDynamicTestingModule, platformBrowserDynamicTesting } = await import('@angular/platform-browser-dynamic/testing');
  const { LoaderComponent } = await import('../packages/angular/dist/index.js');

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  await TestBed.configureTestingModule({ imports: [LoaderComponent] }).compileComponents();
  const fixture = TestBed.createComponent(LoaderComponent);
  fixture.componentRef.setInput('type', 'ring');
  fixture.componentRef.setInput('label', 'Loading data');
  fixture.detectChanges();
  assert.match(fixture.nativeElement.innerHTML, /aria-label="Loading data"/);

  fixture.componentRef.setInput('type', 'progress-bar');
  fixture.componentRef.setInput('value', 25);
  fixture.componentRef.setInput('max', 100);
  fixture.detectChanges();
  assert.match(fixture.nativeElement.innerHTML, /aria-valuenow="25"/);

  fixture.destroy();
  assert.equal(fixture.nativeElement.innerHTML, '');
});
