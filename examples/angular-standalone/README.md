# Angular (standalone components)

```sh
npm install
npm run dev
```

| File | The thing worth copying |
| --- | --- |
| `src/app.component.ts` | `WAVELO_DEFAULTS` provided once for the tree, `skeleton-feed` with `[count]`, and an `inline` `size="1em"` loader inside a sentence |
| `src/save-button.component.ts` | one `button-confirm` design driven by `data-wavelo-state`, with the label bound so an OnPush component re-renders when the state changes |
| `src/main.ts` | `bootstrapApplication`, no NgModule |

The component's inputs cover the whole configuration surface, and `style` is bound as
`waveloStyle` because Angular already owns `[style]`. For SSR, add
`node_modules/@wavelo/core/styles.css` to the server builder's `styles`.

This folder is the application's own source. Created with `ng new --standalone`, which
supplies the build configuration and polyfills; the two components and `main.ts` are what
you write.

`npm run verify:examples` compiles these files with the Angular compiler — the same
`ngc -p` the library's own packaging gate uses, with `strictTemplates` on — so an example
that an AOT build would reject cannot be committed.
