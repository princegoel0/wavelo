import { css as fadeDotFrames } from '../keyframes/fade-dot.js';
import { css as altDotFrames } from '../keyframes/alt-dot.js';
import { css as altDotReverseFrames } from '../keyframes/alt-dot-reverse.js';
import { css as staggerDotFrames } from '../keyframes/stagger-dot.js';
import { css as typingDotFrames } from '../keyframes/typing-dot.js';
import { css as tripFrames } from '../keyframes/trip.js';
import { css as neuralFrames } from '../keyframes/neural.js';
import { css as magnetFrames } from '../keyframes/magnet.js';
import { css as pendulumFrames } from '../keyframes/pendulum.js';
import { css as bubbleFrames } from '../keyframes/bubble.js';
import { css as constellationFrames } from '../keyframes/constellation.js';
import { css as constellationLineFrames } from '../keyframes/constellation-line.js';

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
/* Five dots pulled toward the middle and released. How far each one travels is its own,
   so the row breathes inward from both ends and the middle dot only shrinks. */
.wavelo--magnetic-dots .wavelo__part{animation:wavelo-magnet calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--magnetic-dots .wavelo__part:nth-child(1){--pull:-52%}
.wavelo--magnetic-dots .wavelo__part:nth-child(2){--pull:-24%}
.wavelo--magnetic-dots .wavelo__part:nth-child(4){--pull:24%}
.wavelo--magnetic-dots .wavelo__part:nth-child(5){--pull:52%}
/* A bob on an arm. The pivot is above the dot, so the swing describes the arc the name
   promises rather than a side-to-side slide. */
.wavelo--pendulum .wavelo__part{position:absolute;left:50%;top:14%;width:calc(var(--wavelo-size,2.5rem) / 4);height:calc(var(--wavelo-size,2.5rem) / 4);margin-left:calc(var(--wavelo-size,2.5rem) / -8);transform-origin:50% -150%;animation:wavelo-pendulum calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Bubbles rising: each leaves the bottom, grows and fades out before it reaches the
   top, so the column never looks like a row of dots bouncing. */
.wavelo--bubble-rise{align-items:flex-end}
.wavelo--bubble-rise .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 7);height:calc(var(--wavelo-size,2.5rem) / 7);animation:wavelo-bubble calc(var(--wavelo-duration,1s) * 1.8) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--bubble-rise .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.36)}
.wavelo--bubble-rise .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.72)}
.wavelo--bubble-rise .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1.08)}
.wavelo--bubble-rise .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -1.44)}
/* A constellation: five fixed nodes brighten in turn while two lines drawn between
   them appear and fade again. */
.wavelo--constellation{display:block;background:transparent}
.wavelo--constellation.wavelo-inline{display:inline-block}
.wavelo--constellation .wavelo__part{position:absolute;width:11%;height:11%;border-radius:50%;animation:wavelo-constellation calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--constellation .wavelo__part:nth-child(1){left:10%;top:18%}
.wavelo--constellation .wavelo__part:nth-child(2){left:58%;top:8%}
.wavelo--constellation .wavelo__part:nth-child(3){left:34%;top:44%;animation-delay:calc(var(--wavelo-duration,1s) * -.5)}
.wavelo--constellation .wavelo__part:nth-child(4){left:76%;top:62%;animation-delay:calc(var(--wavelo-duration,1s) * -1)}
.wavelo--constellation .wavelo__part:nth-child(5){left:18%;top:74%;animation-delay:calc(var(--wavelo-duration,1s) * -1.5)}
.wavelo--constellation:before,.wavelo--constellation:after{content:"";position:absolute;height:var(--wavelo-stroke,1px);background:currentColor;transform-origin:0 50%;animation:wavelo-constellation-line calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--constellation:before{left:15%;top:22%;width:48%;transform:rotate(14deg)}
.wavelo--constellation:after{left:38%;top:48%;width:42%;transform:rotate(24deg)}
${fadeDotFrames}${altDotFrames}${altDotReverseFrames}${staggerDotFrames}${typingDotFrames}${tripFrames}${neuralFrames}${magnetFrames}${pendulumFrames}${bubbleFrames}${constellationFrames}${constellationLineFrames}`;
