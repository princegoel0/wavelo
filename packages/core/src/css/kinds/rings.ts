import { css as rippleFrames } from '../keyframes/ripple.js';
import { css as infinityFrames } from '../keyframes/infinity.js';
import { css as squareSpinFrames } from '../keyframes/square-spin.js';
import { css as concentricFrames } from '../keyframes/concentric.js';

export const ringsCss = `
.wavelo--rings:before,.wavelo--rings:after{content:"";position:absolute;border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;border-right-color:transparent;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--rings:before{inset:10%}
.wavelo--rings:after{inset:28%;animation-direction:reverse;opacity:.65}
.wavelo--infinity{background:transparent;border:0}
/* The figure eight is drawn rather than typed. The track is two circle outlines that
   touch at the centre of the box — 44% of it each, so they meet at 50% — and the dots run
   that path. Before this, the design set its content to the infinity glyph and slid two
   ellipses past each other, which read as a cluster of circles with a character in it. */
.wavelo--infinity:before,.wavelo--infinity:after{content:"";position:absolute;top:28%;width:44%;height:44%;border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;background:transparent;opacity:.28}
.wavelo--infinity:before{left:6%}
.wavelo--infinity:after{right:6%}
.wavelo--infinity .wavelo__part{position:absolute;left:50%;top:50%;width:16%;height:16%;border-radius:50%;animation:wavelo-infinity calc(var(--wavelo-duration,1s) * 2) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--infinity .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.667)}
.wavelo--infinity .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -1.333)}
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
