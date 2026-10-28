export const progressCss = `
.wavelo--progress{width:var(--wavelo-width);height:var(--wavelo-height);min-width:4rem;max-height:1rem;overflow:hidden;border-radius:999px;background:color-mix(in srgb,currentColor 18%,transparent)}
.wavelo--progress .wavelo__part{height:100%;width:var(--wavelo-progress);border-radius:inherit;transition:width .2s ease}
.wavelo--progress-ring{width:var(--wavelo-size);height:var(--wavelo-size);max-height:none;overflow:visible;border:var(--wavelo-stroke) solid color-mix(in srgb,currentColor 18%,transparent);border-top-color:currentColor;border-radius:50%;background:conic-gradient(currentColor var(--wavelo-progress),color-mix(in srgb,currentColor 18%,transparent) 0);animation:none}
.wavelo--progress-ring .wavelo__part{display:none}
.wavelo--progress-steps .wavelo__part{width:calc(var(--wavelo-progress) / 5);height:100%;margin-right:2px}
.wavelo--progress-top{position:fixed;top:0;left:0;width:100%;height:3px;max-height:3px;border-radius:0}
`;
