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

  /** Last markup that rendered cleanly, so a bad attribute cannot blank the loader. */
  private lastGood = '';

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
    try {
      const result = renderLoader(configFromAttributes(values));
      ensureStyles(result.css);
      this.lastGood = result.html;
      this.removeAttribute('data-wavelo-error');
      // The string comes from renderLoader, which escapes every configured value.
      this.innerHTML = this.lastGood;
    } catch (error) {
      // A typo in an attribute must not take the UI down with it: report it once,
      // keep showing the last valid loader, and mark the element for inspection.
      const message = error instanceof Error ? error.message : String(error);
      console.error(`wavelo-loader: ${message}`);
      this.setAttribute('data-wavelo-error', message);
      if (this.lastGood) this.innerHTML = this.lastGood;
    }
  }
}

export function defineWaveloElements(): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get('wavelo-loader')) customElements.define('wavelo-loader', WaveloLoaderElement);
}
