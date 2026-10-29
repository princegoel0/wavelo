import { css as uploadFrames } from '../keyframes/upload.js';
import { css as transitionFrames } from '../keyframes/transition.js';

export const progressCss = `
.wavelo--progress{width:var(--wavelo-width,var(--wavelo-size,8rem));height:var(--wavelo-height,.5rem);overflow:hidden;border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 18%,transparent)}
.wavelo--progress .wavelo__part{height:100%;width:var(--wavelo-progress,35%);border-radius:inherit;transition:width .2s ease}
.wavelo--progress-ring{width:var(--wavelo-size,2.5rem);height:var(--wavelo-size,2.5rem);overflow:visible;border:var(--wavelo-stroke,3px) solid color-mix(in srgb,currentColor 18%,transparent);border-radius:50%;background:conic-gradient(currentColor var(--wavelo-progress,35%),color-mix(in srgb,currentColor 18%,transparent) 0);animation:none}
.wavelo--progress-ring .wavelo__part{display:none}
.wavelo--progress-steps{width:var(--wavelo-width,var(--wavelo-size,8rem));gap:var(--wavelo-gap,3px);border-radius:var(--wavelo-radius,3px);background:transparent}
.wavelo--progress-steps .wavelo__part{flex:1 1 0;width:auto;height:100%;margin:0;border-radius:var(--wavelo-radius,2px);background:color-mix(in srgb,currentColor 18%,transparent);transition:none}
.wavelo--progress-steps .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
.wavelo--segmented-bar{border-radius:var(--wavelo-radius,3px)}
.wavelo--segmented-bar .wavelo__part{background:repeating-linear-gradient(90deg,currentColor 0 10px,transparent 10px 13px);border-radius:0}
.wavelo--progress-upload .wavelo__part{background:repeating-linear-gradient(45deg,currentColor 0 6px,color-mix(in srgb,currentColor 45%,transparent) 6px 12px);background-size:24px 100%;animation:wavelo-upload var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--page-transition{position:relative;top:0;left:0;width:100%;height:var(--wavelo-height,3px);border-radius:0;z-index:var(--wavelo-z-index,9999)}
.wavelo--page-transition .wavelo__part{background:linear-gradient(90deg,color-mix(in srgb,currentColor 35%,transparent),currentColor,color-mix(in srgb,currentColor 35%,transparent));background-size:200% 100%;animation:wavelo-transition var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--progress-top{position:fixed;top:0;left:0;width:100%;height:var(--wavelo-height,3px);border-radius:0;z-index:var(--wavelo-z-index,9999)}
${uploadFrames}${transitionFrames}`;
