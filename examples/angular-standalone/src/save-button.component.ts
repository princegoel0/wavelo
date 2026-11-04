import { Component, signal } from '@angular/core';
import { LoaderComponent } from '@wavelo/angular';

type State = 'idle' | 'loading' | 'success' | 'error';

const labels: Record<State, string> = {
  idle: 'Save draft',
  loading: 'Saving',
  success: 'Saved',
  error: 'Try again'
};

// One design for the whole lifecycle. `data-wavelo-state` is read from the host element
// when the loader renders, so the label is bound as well: it names the state for
// assistive technology, and it is the input change that makes an OnPush component
// re-render and pick the new attribute up.
@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [LoaderComponent],
  template: `
    <button type="button" (click)="save()" [disabled]="state() === 'loading'" [attr.aria-busy]="state() === 'loading'">
      {{ labels[state()] }}
    </button>
    <wavelo-loader
      type="button-confirm"
      [size]="20"
      [attr.data-wavelo-state]="state()"
      [label]="labels[state()]"
      [loading]="state() !== 'idle'"
    />
    <span>{{ saved() }} saved</span>
  `
})
export class SaveButtonComponent {
  readonly labels = labels;
  readonly state = signal<State>('idle');
  readonly saved = signal(0);

  async save(): Promise<void> {
    this.state.set('loading');
    await new Promise((resolve) => setTimeout(resolve, 1400));
    this.state.set('success');
    this.saved.update((count) => count + 1);
    setTimeout(() => this.state.set('idle'), 1600);
  }
}
