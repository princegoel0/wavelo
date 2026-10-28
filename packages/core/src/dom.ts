import { renderLoader } from './render-catalog.js';
import { ensureStyles } from './styles.js';
import type { LoaderConfig } from './types.js';

/**
 * Renders a design into `element` and returns its detach function. The design's
 * stylesheet slice is added to the document head once, no matter how many
 * loaders share it.
 */
export function mountLoader(element: HTMLElement, config: LoaderConfig = {}): () => void {
  const result = renderLoader(config);
  ensureStyles(result.css);
  element.innerHTML = result.html;
  return () => {
    element.replaceChildren();
  };
}

export function createLoaderElement(config: LoaderConfig = {}): HTMLSpanElement {
  const element = document.createElement('span');
  mountLoader(element, config);
  return element;
}
