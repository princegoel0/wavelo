import { renderLoader } from './render-catalog.js';
import { LoaderConfig } from './types.js';

export function mountLoader(element: HTMLElement, config: LoaderConfig = {}): () => void {
  const result = renderLoader(config);
  element.innerHTML = `${result.html}`;
  const style = document.createElement('style');
  style.setAttribute('data-wavelo-style', '');
  style.textContent = result.css;
  element.appendChild(style);
  return () => {
    element.replaceChildren();
    style.remove();
  };
}

export function createLoaderElement(config: LoaderConfig = {}): HTMLSpanElement {
  const element = document.createElement('span');
  mountLoader(element, config);
  return element;
}
