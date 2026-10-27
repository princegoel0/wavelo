import { renderLoader } from '@wavelo/core';
import type { LoaderConfig } from '@wavelo/core';

const attributes = ['type', 'size', 'width', 'height', 'color', 'secondary-color', 'background-color', 'speed', 'duration', 'label', 'paused', 'value', 'max', 'reduced-motion'];
const HTMLElementBase: typeof HTMLElement = typeof HTMLElement === 'undefined'
  ? class {} as typeof HTMLElement
  : HTMLElement;

export class WaveloLoaderElement extends HTMLElementBase {
  static observedAttributes = attributes;
  private styleElement?: HTMLStyleElement;
  connectedCallback(): void { this.render(); }
  attributeChangedCallback(): void { if (this.isConnected) this.render(); }
  disconnectedCallback(): void { this.replaceChildren(); this.styleElement = undefined; }
  private render(): void {
    const config: LoaderConfig = {};
    for (const attribute of attributes) {
      const value = this.getAttribute(attribute);
      if (value === null) continue;
      const key = attribute.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof LoaderConfig;
      if (key === 'size' || key === 'width' || key === 'height' || key === 'value' || key === 'max') (config as Record<string, unknown>)[key] = Number(value);
      else if (key === 'speed') config.speed = Number(value);
      else if (key === 'paused') config.paused = value !== 'false';
      else if (key === 'reducedMotion') config.reducedMotion = value as LoaderConfig['reducedMotion'];
      else (config as Record<string, unknown>)[key] = value;
    }
    const result = renderLoader(config);
    this.innerHTML = result.html;
    this.styleElement?.remove();
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = result.css;
    this.appendChild(this.styleElement);
  }
}

export function defineWaveloElements(): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get('wavelo-loader')) customElements.define('wavelo-loader', WaveloLoaderElement);
}
