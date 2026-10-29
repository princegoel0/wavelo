import { css as fadeDotFrames } from '../keyframes/fade-dot.js';
import { css as altDotFrames } from '../keyframes/alt-dot.js';
import { css as altDotReverseFrames } from '../keyframes/alt-dot-reverse.js';
import { css as staggerDotFrames } from '../keyframes/stagger-dot.js';
import { css as typingDotFrames } from '../keyframes/typing-dot.js';
import { css as tripFrames } from '../keyframes/trip.js';
import { css as neuralFrames } from '../keyframes/neural.js';

export const dotsCss = `
.wavelo--dots{gap:var(--wavelo-gap,calc(var(--wavelo-size,2.5rem) / 7))}
.wavelo--dots .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 5);height:calc(var(--wavelo-size,2.5rem) / 5);border-radius:50%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--dots .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1 / 3)}
.wavelo--dots .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -5 / 6)}
.wavelo--dotted-circle{display:block;border:0;background:transparent}
.wavelo--dotted-circle.wavelo-inline{display:inline-block}
.wavelo--dotted-circle .wavelo__part{position:absolute;width:calc(var(--wavelo-size,2.5rem) / 7);height:calc(var(--wavelo-size,2.5rem) / 7);border-radius:50%;animation:wavelo-dot-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dotted-circle .wavelo__part:nth-child(1){transform:rotate(0deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(2){transform:rotate(45deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(3){transform:rotate(90deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(4){transform:rotate(135deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(5){transform:rotate(180deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(6){transform:rotate(225deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(7){transform:rotate(270deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(8){transform:rotate(315deg) translateY(calc(var(--wavelo-size,2.5rem) * -.36))}
.wavelo--bouncing-dots .wavelo__part{animation:wavelo-bounce-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fading-dots .wavelo__part{animation:wavelo-fade-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-dots .wavelo__part:nth-child(odd){animation:wavelo-alt-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-dots .wavelo__part:nth-child(even){animation:wavelo-alt-dot-reverse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--staggered-dots .wavelo__part{animation:wavelo-stagger-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--infinite-scroll{gap:var(--wavelo-gap,4px)}
.wavelo--infinite-scroll .wavelo__part{width:12%;height:12%;animation:wavelo-bounce-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A reply arriving: three dots lift in a chain and settle before the next one starts,
   which is why the last dot carries the longest delay and the first none at all. */
.wavelo--typing-dots{gap:var(--wavelo-gap,calc(var(--wavelo-size,2.5rem) / 8))}
.wavelo--typing-dots .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 6);height:calc(var(--wavelo-size,2.5rem) / 6);animation:wavelo-typing-dot calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--typing-dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * .18)}
.wavelo--typing-dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * .36)}
/* Three arcs on the same circle, a third of a turn apart. The turn is in the
   keyframes, so the arcs travel the ring instead of spinning where they stand. */
.wavelo--trip-orbit .wavelo__part{position:absolute;left:50%;top:50%;width:22%;height:22%;margin:calc(var(--wavelo-size,2.5rem) * -.11);border:var(--wavelo-stroke,3px) solid currentColor;border-right-color:transparent;background:transparent;transform-origin:50% 50%;animation:wavelo-trip var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--trip-orbit .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--trip-orbit .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
/* Nine nodes pulsing along a diagonal, the way activity is drawn across a network. */
.wavelo--neural-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:var(--wavelo-gap,12%);width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));background:transparent}
.wavelo--neural-grid.wavelo-inline{display:inline-grid}
.wavelo--neural-grid .wavelo__part{width:100%;height:100%;border-radius:50%;animation:wavelo-neural calc(var(--wavelo-duration,1s) * 1.5) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--neural-grid .wavelo__part:nth-child(2),.wavelo--neural-grid .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.25)}
.wavelo--neural-grid .wavelo__part:nth-child(3),.wavelo--neural-grid .wavelo__part:nth-child(5),.wavelo--neural-grid .wavelo__part:nth-child(7){animation-delay:calc(var(--wavelo-duration,1s) * -.5)}
.wavelo--neural-grid .wavelo__part:nth-child(6),.wavelo--neural-grid .wavelo__part:nth-child(8){animation-delay:calc(var(--wavelo-duration,1s) * -.75)}
.wavelo--neural-grid .wavelo__part:nth-child(9){animation-delay:calc(var(--wavelo-duration,1s) * -1)}
.wavelo--dot-matrix{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:var(--wavelo-gap,calc(var(--wavelo-size,2.5rem) / 14));width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));background:transparent}
.wavelo--dot-matrix.wavelo-inline{display:inline-grid}
.wavelo--dot-matrix .wavelo__part{width:100%;height:100%;border-radius:22%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dot-matrix .wavelo__part:nth-child(2),.wavelo--dot-matrix .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) / -4)}
.wavelo--dot-matrix .wavelo__part:nth-child(3),.wavelo--dot-matrix .wavelo__part:nth-child(5),.wavelo--dot-matrix .wavelo__part:nth-child(7){animation-delay:calc(var(--wavelo-duration,1s) / -2)}
.wavelo--dot-matrix .wavelo__part:nth-child(6),.wavelo--dot-matrix .wavelo__part:nth-child(8){animation-delay:calc(var(--wavelo-duration,1s) * -3 / 4)}
${fadeDotFrames}${altDotFrames}${altDotReverseFrames}${staggerDotFrames}${typingDotFrames}${tripFrames}${neuralFrames}`;
