import { css as rippleFrames } from '../keyframes/ripple.js';
import { css as expandRingFrames } from '../keyframes/expand-ring.js';
import { css as infinityFrames } from '../keyframes/infinity.js';
import { css as squareSpinFrames } from '../keyframes/square-spin.js';
import { css as concentricFrames } from '../keyframes/concentric.js';

export const ringsCss = `
.wavelo--rings:before,.wavelo--rings:after{content:"";position:absolute;border:var(--wavelo-stroke) solid currentColor;border-radius:50%;border-right-color:transparent;animation:wavelo-spin var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--rings:before{inset:10%}
.wavelo--rings:after{inset:28%;animation-direction:reverse;opacity:.65}
.wavelo--infinity:before{content:"∞";font-size:var(--wavelo-size);line-height:1}
.wavelo--ripple-circles .wavelo__part,.wavelo--expanding-circles .wavelo__part{position:absolute;border:var(--wavelo-stroke) solid currentColor;border-radius:50%;background:transparent;animation:wavelo-ripple var(--wavelo-duration) ease-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--ripple-circles .wavelo__part:nth-child(1),.wavelo--expanding-circles .wavelo__part:nth-child(1){width:25%;height:25%}
.wavelo--ripple-circles .wavelo__part:nth-child(2),.wavelo--expanding-circles .wavelo__part:nth-child(2){width:55%;height:55%;animation-delay:calc(var(--wavelo-duration) / -3)}
.wavelo--ripple-circles .wavelo__part:nth-child(3),.wavelo--expanding-circles .wavelo__part:nth-child(3){width:85%;height:85%;animation-delay:calc(var(--wavelo-duration) * -2 / 3)}
.wavelo--expanding-circles .wavelo__part{animation-name:wavelo-expand-ring}
.wavelo--infinity{background:transparent;border:0}
.wavelo--infinity .wavelo__part{position:absolute;width:45%;height:35%;border:var(--wavelo-stroke) solid currentColor;border-radius:50%;background:transparent;animation:wavelo-infinity var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--infinity .wavelo__part:first-child{transform:translateX(-35%)}
.wavelo--infinity .wavelo__part:last-child{transform:translateX(35%);animation-delay:calc(var(--wavelo-duration) / -2)}
.wavelo--nested-squares .wavelo__part,.wavelo--concentric-pulse .wavelo__part{position:absolute;background:transparent;border:var(--wavelo-stroke) solid currentColor}
.wavelo--nested-squares .wavelo__part:nth-child(1){inset:8%;transform:rotate(0deg);animation:wavelo-square-spin var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--nested-squares .wavelo__part:nth-child(2){inset:25%;transform:rotate(45deg);animation:wavelo-square-spin var(--wavelo-duration) linear infinite reverse var(--wavelo-play-state)}
.wavelo--nested-squares .wavelo__part:nth-child(3){inset:42%;transform:rotate(22deg);animation:wavelo-square-spin var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--concentric-pulse .wavelo__part{border-radius:50%;inset:12%;animation:wavelo-concentric var(--wavelo-duration) ease-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--concentric-pulse .wavelo__part:nth-child(2){inset:28%;animation-delay:calc(var(--wavelo-duration) / -3)}
.wavelo--concentric-pulse .wavelo__part:nth-child(3){inset:44%;animation-delay:calc(var(--wavelo-duration) * -2 / 3)}
.wavelo--multi-arc{border:var(--wavelo-stroke) solid transparent;border-top-color:currentColor;border-radius:50%;animation:wavelo-spin var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--multi-arc:before{inset:18%;border-top-color:transparent;border-right-color:currentColor}
.wavelo--multi-arc:after{inset:34%;border-top-color:transparent;border-bottom-color:currentColor;animation-direction:normal}
.wavelo--ripple-dot:before{inset:42%;border:0;border-radius:50%;background:currentColor;animation:wavelo-pulse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--ripple-dot:after{inset:0;border:var(--wavelo-stroke) solid currentColor;border-right-color:currentColor;border-radius:50%;opacity:1;animation:wavelo-ripple var(--wavelo-duration) ease-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
${rippleFrames}${expandRingFrames}${infinityFrames}${squareSpinFrames}${concentricFrames}`;
