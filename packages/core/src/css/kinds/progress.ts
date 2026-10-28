import { css as uploadFrames } from '../keyframes/upload.js';
import { css as transitionFrames } from '../keyframes/transition.js';

export const progressCss = `
.wavelo--progress{width:var(--wavelo-width);height:var(--wavelo-height);min-width:4rem;max-height:1rem;overflow:hidden;border-radius:999px;background:color-mix(in srgb,currentColor 18%,transparent)}
.wavelo--progress .wavelo__part{height:100%;width:var(--wavelo-progress);border-radius:inherit;transition:width .2s ease}
.wavelo--progress-ring{min-width:0;width:var(--wavelo-size);height:var(--wavelo-size);max-height:none;overflow:visible;border:var(--wavelo-stroke) solid color-mix(in srgb,currentColor 18%,transparent);border-radius:50%;background:conic-gradient(currentColor var(--wavelo-progress),color-mix(in srgb,currentColor 18%,transparent) 0);animation:none}
.wavelo--progress-ring .wavelo__part{display:none}
.wavelo--progress-steps{min-width:6rem;gap:3px;border-radius:3px;background:transparent}
.wavelo--progress-steps .wavelo__part{flex:1 1 0;width:auto;height:100%;margin:0;border-radius:2px;background:color-mix(in srgb,currentColor 18%,transparent);transition:none}
.wavelo--progress-steps .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
.wavelo--segmented-bar{border-radius:3px}
.wavelo--segmented-bar .wavelo__part{background:repeating-linear-gradient(90deg,currentColor 0 10px,transparent 10px 13px);border-radius:0}
.wavelo--progress-upload .wavelo__part{background:repeating-linear-gradient(45deg,currentColor 0 6px,color-mix(in srgb,currentColor 45%,transparent) 6px 12px);background-size:24px 100%;animation:wavelo-upload var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--page-transition{position:relative;top:0;left:0;width:100%;height:3px;max-height:3px;border-radius:0}
.wavelo--page-transition .wavelo__part{background:linear-gradient(90deg,color-mix(in srgb,currentColor 35%,transparent),currentColor,color-mix(in srgb,currentColor 35%,transparent));background-size:200% 100%;animation:wavelo-transition var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--progress-top{position:fixed;top:0;left:0;width:100%;height:3px;max-height:3px;border-radius:0}
${uploadFrames}${transitionFrames}`;
