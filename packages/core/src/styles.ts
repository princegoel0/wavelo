import { styleKey } from './render.js';

/** Options for the code that puts a slice into the document. */
export interface StyleOptions {
  /**
   * A CSP nonce for the injected `<style>`. When it is absent, Wavelo reads
   * `<meta name="wavelo-csp-nonce">` from the page, so a server that sets a fresh
   * nonce per response needs no call-site change.
   */
  nonce?: string;
}

/**
 * Read per injection rather than stored in a module: a server that renders many
 * responses in one process must not stamp one response's nonce onto another.
 */
function documentNonce(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.querySelector<HTMLMetaElement>('meta[name="wavelo-csp-nonce"]')?.content || undefined;
}

function applyNonce(element: HTMLElement, nonce: string | undefined): void {
  if (!nonce) return;
  // The content attribute, set before insertion: CSP reads the nonce as the element
  // is inserted, and the browser then clears the attribute's value so a script on
  // the page cannot read the nonce back out of the DOM it just stamped.
  element.setAttribute('nonce', nonce);
}

/** A `<style>` element carrying a slice, tagged with the slice's identity. */
export function stylesheetMarkup(css: string, options: StyleOptions = {}): string {
  const nonce = options.nonce ?? documentNonce();
  return `<style${nonce ? ` nonce="${nonce.replace(/"/g, '&quot;')}"` : ''} data-wavelo-style="${styleKey(css)}">${css}</style>`;
}

/**
 * Adds a stylesheet slice to the document once. Rendering several designs that
 * share a slice — or the same design many times — adds one element, because the
 * slice is identified by its own content rather than by the design using it.
 */
export function ensureStyles(css: string, options: StyleOptions = {}): void {
  // A loader that renders nothing asks for no stylesheet, and an empty slice would
  // otherwise add a `<style>` element to every document that hides one.
  if (!css || typeof document === 'undefined') return;
  const key = styleKey(css);
  if (document.head.querySelector(`style[data-wavelo-style="${key}"]`)) return;
  const style = document.createElement('style');
  applyNonce(style, options.nonce ?? documentNonce());
  style.setAttribute('data-wavelo-style', key);
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Every slice used by the page, for server rendering. Emit the returned markup
 * once in the document head instead of inlining styles per component.
 */
export function renderStylesheets(slices: Iterable<string>, options: StyleOptions = {}): string {
  const seen = new Map<string, string>();
  for (const css of slices) {
    if (!css) continue;
    const key = styleKey(css);
    if (!seen.has(key)) seen.set(key, css);
  }
  return [...seen.values()].map((css) => stylesheetMarkup(css, options)).join('');
}
