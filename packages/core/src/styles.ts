import { styleKey } from './render.js';

/** A `<style>` element carrying a slice, tagged with the slice's identity. */
export function stylesheetMarkup(css: string): string {
  return `<style data-wavelo-style="${styleKey(css)}">${css}</style>`;
}

/**
 * Adds a stylesheet slice to the document once. Rendering several designs that
 * share a slice — or the same design many times — adds one element, because the
 * slice is identified by its own content rather than by the design using it.
 */
export function ensureStyles(css: string): void {
  if (typeof document === 'undefined') return;
  const key = styleKey(css);
  if (document.head.querySelector(`style[data-wavelo-style="${key}"]`)) return;
  const style = document.createElement('style');
  style.setAttribute('data-wavelo-style', key);
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Every slice used by the page, for server rendering. Emit the returned markup
 * once in the document head instead of inlining styles per component.
 */
export function renderStylesheets(slices: Iterable<string>): string {
  const seen = new Map<string, string>();
  for (const css of slices) {
    const key = styleKey(css);
    if (!seen.has(key)) seen.set(key, css);
  }
  return [...seen.values()].map((css) => stylesheetMarkup(css)).join('');
}
