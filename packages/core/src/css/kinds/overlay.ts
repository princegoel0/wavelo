
export const overlayCss = `
.wavelo--overlay{position:relative;background:color-mix(in srgb,var(--wavelo-background,#fff) 78%,transparent);border-radius:.5rem}
.wavelo--overlay .wavelo__part{width:35%;height:35%;border-radius:50%;animation:wavelo-pulse var(--wavelo-duration,1s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--overlay,.wavelo--fullscreen{min-width:8rem;min-height:5rem}
.wavelo--fullscreen{width:100vw;height:100vh;position:fixed;inset:0}
`;
