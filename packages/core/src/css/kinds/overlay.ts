
export const overlayCss = `
.wavelo--overlay,.wavelo--fullscreen{position:relative;display:inline-flex;align-items:center;justify-content:center;width:var(--wavelo-width,var(--wavelo-size,8rem));height:var(--wavelo-height,var(--wavelo-size,5rem));background:color-mix(in srgb,var(--wavelo-background,var(--wavelo-scrim,#fff)) 78%,transparent);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-radius:var(--wavelo-radius,.5rem);border:1px solid color-mix(in srgb,currentColor 14%,transparent);box-shadow:0 8px 24px rgba(0,0,0,.15)}
.wavelo--overlay .wavelo__part,.wavelo--fullscreen .wavelo__part{flex:none;width:calc(var(--wavelo-size,2.5rem) * .75);height:calc(var(--wavelo-size,2.5rem) * .75);aspect-ratio:1;border-radius:50%;background:transparent;border:var(--wavelo-stroke,3px) solid color-mix(in srgb,currentColor 22%,transparent);border-top-color:currentColor;animation:wavelo-spin var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A full-screen layer covers the page and sits above it; "width" and "height" are
   the viewport here because that is what the design is. */
.wavelo--fullscreen{width:100vw;height:100vh;position:fixed;inset:0;z-index:var(--wavelo-z-index,9999);border-radius:0;border:0}
/* A fixed overlay is not on anybody's text line, so "inline" means nothing here and
   changes nothing. */
.wavelo--fullscreen.wavelo-inline{vertical-align:baseline}
`;
