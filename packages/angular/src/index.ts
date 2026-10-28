import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { ensureStyles, renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';

export type WaveloInputs = LoaderConfig;

/**
 * Renders a design into the host element. `style` is bound as `waveloStyle`
 * because Angular reserves `[style]` for its own style bindings.
 *
 * Styles land in `document.head` once per slice; for server rendering include
 * `@wavelo/core/styles.css` in the head.
 */
@Component({
  selector: 'wavelo-loader',
  standalone: true,
  template: '',
  styles: [':host{display:contents}'],
  inputs: [
    'type', 'size', 'width', 'height', 'color', 'secondaryColor', 'backgroundColor',
    'speed', 'duration', 'strokeWidth', 'theme', 'direction', 'paused', 'label',
    'className', 'waveloStyle: style', 'reducedMotion', 'data-testid', 'value', 'max'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnChanges, OnDestroy {
  type?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  speed?: number;
  duration?: number | string;
  strokeWidth?: number;
  theme?: LoaderConfig['theme'];
  direction?: LoaderConfig['direction'];
  paused?: boolean;
  label?: string;
  className?: string;
  style?: LoaderConfig['style'];
  reducedMotion?: LoaderConfig['reducedMotion'];
  'data-testid'?: string;
  value?: number;
  max?: number;

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(_changes: SimpleChanges): void {
    const config: LoaderConfig = {
      type: this.type,
      size: this.size,
      width: this.width,
      height: this.height,
      color: this.color,
      secondaryColor: this.secondaryColor,
      backgroundColor: this.backgroundColor,
      speed: this.speed,
      duration: this.duration,
      strokeWidth: this.strokeWidth,
      theme: this.theme,
      direction: this.direction,
      paused: this.paused,
      label: this.label,
      className: this.className,
      style: this.style,
      reducedMotion: this.reducedMotion,
      'data-testid': this['data-testid'],
      value: this.value,
      max: this.max
    };
    const result = renderLoader(this.withHostDataAttributes(config));
    ensureStyles(result.css);
    this.renderer.setProperty(this.element.nativeElement, 'innerHTML', result.html);
  }

  /** `data-*` attributes on the host element are part of the configuration. */
  private withHostDataAttributes(config: LoaderConfig): LoaderConfig {
    const host = this.element.nativeElement as HTMLElement;
    const merged: Record<string, unknown> = { ...config };
    for (const attribute of host.attributes) {
      if (attribute.name.startsWith('data-')) merged[attribute.name] = attribute.value;
    }
    return merged as LoaderConfig;
  }

  ngOnDestroy(): void {
    this.renderer.setProperty(this.element.nativeElement, 'innerHTML', '');
  }
}

/** The render result without Angular, for server rendering and tests. */
export function renderAngularLoader(inputs: WaveloInputs = {}): RenderResult {
  return renderLoader(inputs);
}
