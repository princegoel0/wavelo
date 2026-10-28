import { configFromAttributes, ensureStyles, loaderAttributes, renderLoader } from '@wavelo/core';

// Attribute names are configuration keys in kebab case, plus any `data-*` the
// element carries. Declared statically so `attributeChangedCallback` fires.
const observedAttributes = [...loaderAttributes];

const HTMLElementBase: typeof HTMLElement = typeof HTMLElement === 'undefined'
  ? class {} as unknown as typeof HTMLElement
  : HTMLElement;

/**
 * `<wavelo-loader type="ring" label="Loading">`. The stylesheet slice is added
 * to the document head once, so any number of elements shares it.
 */
export class WaveloLoaderElement extends HTMLElementBase {
  static observedAttributes = observedAttributes;

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  disconnectedCallback(): void {
    this.replaceChildren();
  }

  private render(): void {
    const values: Record<string, string | undefined> = {};
    for (const attribute of observedAttributes) values[attribute] = this.getAttribute(attribute) ?? undefined;
    for (const attribute of this.attributes) {
      if (attribute.name.startsWith('data-')) values[attribute.name] = attribute.value;
    }
    const result = renderLoader(configFromAttributes(values));
    ensureStyles(result.css);
    this.innerHTML = result.html;
  }
}

export function defineWaveloElements(): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get('wavelo-loader')) customElements.define('wavelo-loader', WaveloLoaderElement);
}
