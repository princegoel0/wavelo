import { css as radarFrames } from '../keyframes/radar.js';

export const ringCss = `
.wavelo--ring{border:var(--wavelo-stroke,3px) solid currentColor;border-right-color:transparent;border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--gradient-ring{border-image:linear-gradient(currentColor,var(--wavelo-secondary-color,#a5b4fc)) 1;border-radius:50%}
.wavelo--half-circle{border-bottom-color:transparent}
.wavelo--ellipse{width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:calc(var(--wavelo-height,var(--wavelo-size,2.5rem)) / 2)}
.wavelo--radar{border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 300deg,currentColor 355deg,transparent);animation:wavelo-radar var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--spiral{background:conic-gradient(transparent 0 20deg,currentColor 25deg 35deg,transparent 40deg 80deg,currentColor 85deg 95deg,transparent 100deg);border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--circular{border-color:currentColor}
.wavelo--circular:before{content:"";position:absolute;inset:calc(var(--wavelo-stroke,3px) * -1);border:var(--wavelo-stroke,3px) solid transparent;border-top-color:var(--wavelo-secondary-color,#a5b4fc);border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--thin-line{border-width:1px}
.wavelo--thick-stroke{border-width:calc(var(--wavelo-stroke,3px) * 2.5)}
.wavelo--arc{border-color:transparent;border-top-color:currentColor}
.wavelo--segmented-ring{border-style:dashed;border-right-color:currentColor}
.wavelo--monochrome{border:0;background:conic-gradient(currentColor 0 50%,color-mix(in srgb,currentColor 22%,transparent) 50% 100%);border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${radarFrames}`;
