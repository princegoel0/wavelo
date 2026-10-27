import { ChangeDetectionStrategy, Component, ElementRef, inject, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';

export type WaveloInputs = LoaderConfig;

@Component({
  selector: 'wavelo-loader',
  standalone: true,
  template: '',
  inputs: ['type', 'size', 'color', 'label', 'value', 'max', 'reducedMotion'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnChanges, OnDestroy {
  type?: string;
  size?: number | string;
  color?: string;
  label?: string;
  value?: number;
  max?: number;
  reducedMotion?: LoaderConfig['reducedMotion'];

  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  ngOnChanges(_changes: SimpleChanges): void {
    const config: LoaderConfig = {
      type: this.type, size: this.size, color: this.color, label: this.label,
      value: this.value, max: this.max, reducedMotion: this.reducedMotion
    };
    const result = renderLoader(config);
    this.renderer.setProperty(this.element.nativeElement, 'innerHTML', `<style>${result.css}</style>${result.html}`);
  }

  ngOnDestroy(): void {
    this.renderer.setProperty(this.element.nativeElement, 'innerHTML', '');
  }
}

export function renderAngularLoader(inputs: WaveloInputs = {}): RenderResult { return renderLoader(inputs); }
