import { css as rippleFrames } from '../keyframes/ripple.js';
import { css as infinityFrames } from '../keyframes/infinity.js';
import { css as squareSpinFrames } from '../keyframes/square-spin.js';
import { css as concentricFrames } from '../keyframes/concentric.js';

export const ringsCss = `
.wavelo--rings:before,.wavelo--rings:after{content:"";position:absolute;border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;border-right-color:transparent;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--rings:before{inset:10%}
.wavelo--rings:after{inset:28%;border-color:var(--wavelo-secondary-color,currentColor);animation-direction:reverse;opacity:.65}
.wavelo--infinity{background:transparent;border:0;width:var(--wavelo-width,calc(var(--wavelo-size,2.5rem) * 1.6));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem) * 0.8))}
/* Continuous lemniscate figure-eight track: single smooth SVG mask curve with balanced anti-phase dots */
.wavelo--infinity:before{content:"";box-sizing:border-box;position:absolute;inset:0;width:100%;height:100%;animation:none;transform:none;border-radius:0;background:var(--wavelo-secondary-color,currentColor);opacity:.35;-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50' preserveAspectRatio='none'%3E%3Cpath fill='none' stroke='%23000' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' d='M 50 25 C 65 5, 95 5, 95 25 C 95 45, 65 45, 50 25 C 35 5, 5 5, 5 25 C 5 45, 35 45, 50 25 Z'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50' preserveAspectRatio='none'%3E%3Cpath fill='none' stroke='%23000' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' d='M 50 25 C 65 5, 95 5, 95 25 C 95 45, 65 45, 50 25 C 35 5, 5 5, 5 25 C 5 45, 35 45, 50 25 Z'/%3E%3C/svg%3E");-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;border:var(--wavelo-stroke,3px) solid transparent}
.wavelo--infinity:after{content:none;display:none}
.wavelo--infinity .wavelo__part{position:absolute;left:50%;top:50%;width:12px;height:12px;aspect-ratio:1;border-radius:50%;background:currentColor;box-shadow:0 0 6px currentColor;animation:wavelo-infinity calc(var(--wavelo-duration,1s) * 2) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--infinity .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -1);background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 35%,#ec4899));box-shadow:0 0 6px var(--wavelo-secondary-color,color-mix(in srgb,currentColor 35%,#ec4899))}

.wavelo--ripple-circles .wavelo__part{position:absolute;border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;background:transparent;animation:wavelo-ripple var(--wavelo-duration,1s) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--ripple-circles .wavelo__part:nth-child(1){width:25%;height:25%}
.wavelo--ripple-circles .wavelo__part:nth-child(2){width:55%;height:55%;animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--ripple-circles .wavelo__part:nth-child(3){width:85%;height:85%;animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--nested-squares .wavelo__part,.wavelo--concentric-pulse .wavelo__part{position:absolute;background:transparent;border:var(--wavelo-stroke,3px) solid currentColor}
.wavelo--nested-squares .wavelo__part:nth-child(1){inset:8%;transform:rotate(0deg);animation:wavelo-square-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--nested-squares .wavelo__part:nth-child(2){inset:25%;transform:rotate(45deg);animation:wavelo-square-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite reverse var(--wavelo-play-state,running)}
.wavelo--nested-squares .wavelo__part:nth-child(3){inset:42%;transform:rotate(22deg);animation:wavelo-square-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--concentric-pulse .wavelo__part{border-radius:50%;inset:12%;animation:wavelo-concentric var(--wavelo-duration,1s) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--concentric-pulse .wavelo__part:nth-child(2){inset:28%;animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--concentric-pulse .wavelo__part:nth-child(3){inset:44%;animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--multi-arc{border:var(--wavelo-stroke,3px) solid transparent;border-top-color:currentColor;border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--multi-arc:before{inset:18%;border-top-color:transparent;border-right-color:currentColor}
.wavelo--multi-arc:after{inset:34%;border-top-color:transparent;border-bottom-color:currentColor;animation-direction:normal}
.wavelo--ripple-dot:before{inset:42%;border:0;border-radius:50%;background:currentColor;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--ripple-dot:after{inset:0;border:var(--wavelo-stroke,3px) solid currentColor;border-right-color:currentColor;border-radius:50%;opacity:1;animation:wavelo-ripple var(--wavelo-duration,1s) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${rippleFrames}${infinityFrames}${squareSpinFrames}${concentricFrames}`;
