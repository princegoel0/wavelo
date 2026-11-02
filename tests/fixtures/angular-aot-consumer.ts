// Compiled by `npm run verify:angular` with the Angular compiler, in the same mode an
// application uses: nothing here imports `@angular/compiler` at runtime, so the import of
// `LoaderComponent` only resolves if the shipped package carries a real component
// declaration. It is the shape docs/FRAMEWORKS.md tells consumers to write.
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { LoaderComponent } from '@wavelo/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoaderComponent],
  template: '<wavelo-loader type="ring" label="Loading data" [size]="48" />'
})
export class Screen {}

bootstrapApplication(Screen);
