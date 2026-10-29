
export const overlayCss = `
.wavelo--overlay,.wavelo--fullscreen{position:relative;width:var(--wavelo-width,var(--wavelo-size,8rem));height:var(--wavelo-height,var(--wavelo-size,5rem));background:color-mix(in srgb,var(--wavelo-background,var(--wavelo-scrim,#fff)) 78%,transparent);border-radius:var(--wavelo-radius,.5rem)}
.wavelo--overlay .wavelo__part{width:35%;height:35%;border-radius:50%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A full-screen layer covers the page and sits above it; "width" and "height" are
   the viewport here because that is what the design is. */
.wavelo--fullscreen{width:100vw;height:100vh;position:fixed;inset:0;z-index:var(--wavelo-z-index,9999)}
/* A fixed overlay is not on anybody's text line, so "inline" means nothing here and
   changes nothing. */
.wavelo--fullscreen.wavelo-inline{vertical-align:baseline}
`;
