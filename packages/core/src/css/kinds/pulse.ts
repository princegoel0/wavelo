import { css as scaleDotFrames } from '../keyframes/scale-dot.js';
import { css as thinkFrames } from '../keyframes/think.js';
import { css as thinkHaloFrames } from '../keyframes/think-halo.js';
import { css as blinkFrames } from '../keyframes/blink.js';

export const pulseCss = `
.wavelo--pulse .wavelo__part{width:55%;height:55%;border-radius:50%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--scaling-dots .wavelo__part{animation:wavelo-scale-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--button .wavelo__part{width:30%;height:30%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--inline .wavelo__part{width:18%;height:18%;animation:wavelo-bounce-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Three dots across a box cannot each be 55% of it: they overflowed and flex squeezed
   them sideways into 0.6-aspect ellipses while border-radius drew the round ends. Sized
   to fit the row, and told not to shrink. */
.wavelo--pulsing-dots .wavelo__part,.wavelo--scaling-dots .wavelo__part,.wavelo--background-operation .wavelo__part{flex:none;width:26%;height:26%}
.wavelo--pulsing-dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--pulsing-dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--expanding-dot .wavelo__part{width:70%;height:70%;animation:wavelo-scale-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--grid-pulse{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:var(--wavelo-gap,calc(var(--wavelo-size,2.5rem) / 10));width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));background:transparent}
.wavelo--grid-pulse.wavelo-inline{display:inline-grid}
.wavelo--grid-pulse .wavelo__part{width:100%;height:100%;border-radius:18%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--grid-pulse .wavelo__part:nth-child(2),.wavelo--grid-pulse .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) / -2)}
/* A model at work: one orb breathing, with a halo leaving it at half the cycle so
   the two read as a pulse rather than a spinner. */
.wavelo--thinking-glow .wavelo__part{width:44%;height:44%;animation:wavelo-think calc(var(--wavelo-duration,1s) * 1.8) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--thinking-glow:before{content:"";position:absolute;inset:8%;border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;background:transparent;animation:wavelo-think-halo calc(var(--wavelo-duration,1s) * 1.8) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* The caret at the end of a streamed answer. It is a block, not a round dot, and it
   spends the first half of the cycle lit. */
.wavelo--stream-cursor .wavelo__part{width:42%;height:72%;border-radius:var(--wavelo-radius,2px);animation:wavelo-blink var(--wavelo-duration,1s) var(--wavelo-ease,steps(1,end)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${scaleDotFrames}${thinkFrames}${thinkHaloFrames}${blinkFrames}`;
