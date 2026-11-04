import { Component } from '@angular/core';
import { LoaderComponent, WAVELO_DEFAULTS } from '@wavelo/angular';
import { SaveButtonComponent } from './save-button.component';

// WAVELO_DEFAULTS is per injector, never a module global, so a server render cannot leak
// one request's house style into another.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoaderComponent, SaveButtonComponent],
  providers: [{ provide: WAVELO_DEFAULTS, useValue: { color: '#6366f1', size: 24, reducedMotion: 'auto' } }],
  template: `
    <main class="page">
      <h1>Wavelo in a standalone Angular app</h1>

      @if (loading) {
        <!-- The placeholder is the shape of the list that replaces it, and count repeats
             the tracks the design is built from. -->
        <wavelo-loader type="skeleton-feed" [count]="3" label="Loading stories" />
      } @else {
        <ul>
          @for (story of stories; track story) {
            <li>{{ story }}</li>
          }
        </ul>
      }

      <app-save-button />

      <p>
        Syncing
        <!-- inline puts the box on the text line; with a sentence already saying it, the
             loader is decorative and carries no label. -->
        <wavelo-loader type="three-dots" [inline]="true" [decorative]="true" [loading]="loading" size="1em" />
      </p>
    </main>
  `
})
export class AppComponent {
  loading = true;
  stories = ['A loader that never moved the text', 'Reduced motion, twice, in one sheet'];

  constructor() {
    setTimeout(() => (this.loading = false), 1800);
  }
}
