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
import { css as dotRingFrames } from '../keyframes/dot-ring.js';
import { css as constellationFrames } from '../keyframes/constellation.js';
import { css as constellationLineFrames } from '../keyframes/constellation-line.js';

export const dotsCss = `
/* The dots are flex items, and N of them at a fifth of the box plus gaps at a seventh
   overflowed the box, so flex shrank them sideways — 8px tall by 3.4px wide — and
   border-radius:50% on a non-square box draws an ellipse. That is why every "dots" design
   in this family read as ovals. flex:none stops the squeeze, and the size and gap are set
   so five dots actually fit the box they are given. */
.wavelo--dots{gap:var(--wavelo-gap,calc(var(--wavelo-size,2.5rem) / 20))}
.wavelo--dots .wavelo__part{flex:none;width:calc(var(--wavelo-size,2.5rem) / 7);height:calc(var(--wavelo-size,2.5rem) / 7);border-radius:50%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--dots .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1 / 3)}
.wavelo--dots .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -5 / 6)}

.wavelo--dotted-circle{display:block;border:0;background:transparent}
.wavelo--dotted-circle.wavelo-inline{display:inline-block}
/* Eight dots on a ring. Each one is centred in the box, turned to its own angle and
   pushed out by the radius, and the animation touches only opacity — a keyframe that
   animated transform would replace that placement the moment it started, which is what
   this design used to do: the eight dots collapsed into a drifting cluster. The stagger
   is the delay, so the bright dot walks round the circle. */
.wavelo--dotted-circle .wavelo__part{position:absolute;left:50%;top:50%;width:calc(var(--wavelo-size,2.5rem) / 7);height:calc(var(--wavelo-size,2.5rem) / 7);margin:calc(var(--wavelo-size,2.5rem) / -14);border-radius:50%;--a:0deg;transform:rotate(var(--a)) translateY(calc(var(--wavelo-size,2.5rem) * -.36));animation:wavelo-dot-ring calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dotted-circle .wavelo__part:nth-child(2){--a:45deg;animation-delay:calc(var(--wavelo-duration,1s) * -.2)}
.wavelo--dotted-circle .wavelo__part:nth-child(3){--a:90deg;animation-delay:calc(var(--wavelo-duration,1s) * -.4)}
.wavelo--dotted-circle .wavelo__part:nth-child(4){--a:135deg;animation-delay:calc(var(--wavelo-duration,1s) * -.6)}
.wavelo--dotted-circle .wavelo__part:nth-child(5){--a:180deg;animation-delay:calc(var(--wavelo-duration,1s) * -.8)}
.wavelo--dotted-circle .wavelo__part:nth-child(6){--a:225deg;animation-delay:calc(var(--wavelo-duration,1s) * -1)}
.wavelo--dotted-circle .wavelo__part:nth-child(7){--a:270deg;animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--dotted-circle .wavelo__part:nth-child(8){--a:315deg;animation-delay:calc(var(--wavelo-duration,1s) * -1.4)}
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
.wavelo--pendulum:before{content:"";position:absolute;left:50%;top:10%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:currentColor;opacity:.9;z-index:2}
.wavelo--pendulum .wavelo__part{position:absolute;left:50%;top:10%;width:var(--wavelo-stroke,2px);height:68%;margin-left:calc(var(--wavelo-stroke,2px) * -.5);transform-origin:top center;background:currentColor;border-radius:1px;animation:wavelo-pendulum calc(var(--wavelo-duration,1s) * 1.5) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--pendulum .wavelo__part:after{content:"";position:absolute;bottom:0;left:50%;width:calc(var(--wavelo-size,2.5rem) * .28);height:calc(var(--wavelo-size,2.5rem) * .28);margin-left:calc(var(--wavelo-size,2.5rem) * -.14);transform:translateY(50%);border-radius:50%;background:currentColor;box-shadow:0 1px 3px rgba(0,0,0,0.25)}
/* Bubbles rising: each leaves the bottom, grows and fades out before it reaches the
   top, so the column never looks like a row of dots bouncing. */
.wavelo--bubble-rise{align-items:flex-end;overflow:hidden}
.wavelo--bubble-rise .wavelo__part{position:absolute;bottom:8%;border-radius:50%;border:1px solid currentColor;background:color-mix(in srgb,currentColor 35%,transparent);animation:wavelo-bubble calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--bubble-rise .wavelo__part:nth-child(1){left:14%;width:18%;height:18%;animation-delay:0s}
.wavelo--bubble-rise .wavelo__part:nth-child(2){left:32%;width:12%;height:12%;animation-delay:calc(var(--wavelo-duration,1s) * -.25)}
.wavelo--bubble-rise .wavelo__part:nth-child(3){left:50%;width:22%;height:22%;animation-delay:calc(var(--wavelo-duration,1s) * -.55)}
.wavelo--bubble-rise .wavelo__part:nth-child(4){left:68%;width:14%;height:14%;animation-delay:calc(var(--wavelo-duration,1s) * -.85)}
.wavelo--bubble-rise .wavelo__part:nth-child(5){left:82%;width:16%;height:16%;animation-delay:calc(var(--wavelo-duration,1s) * -1.15)}
.wavelo--bubble-rise .wavelo__part:nth-child(6){left:24%;width:20%;height:20%;animation-delay:calc(var(--wavelo-duration,1s) * -1.45)}
.wavelo--bubble-rise .wavelo__part:nth-child(7){left:58%;width:13%;height:13%;animation-delay:calc(var(--wavelo-duration,1s) * -1.7)}
.wavelo--bubble-rise .wavelo__part:nth-child(8){left:40%;width:16%;height:16%;animation-delay:calc(var(--wavelo-duration,1s) * -1.95)}
/* Astronomical constellations: authentic star geometries with connecting lines.
   Supports Ursa Major (default), Orion, Cassiopeia, Cygnus, and Ursa Minor. */
.wavelo--constellation{display:block;background:transparent;position:relative}
.wavelo--constellation.wavelo-inline{display:inline-block}
.wavelo--constellation .wavelo__part{position:absolute;border-radius:50%;background:currentColor;box-shadow:0 0 5px currentColor,0 0 8px color-mix(in srgb,currentColor 40%,transparent);animation:wavelo-constellation calc(var(--wavelo-duration,1s) * 2.2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--constellation:before,.wavelo--constellation:after{content:"";position:absolute;inset:0;background:currentColor;opacity:.35;pointer-events:none;border:var(--wavelo-stroke,1px) solid transparent;animation:wavelo-constellation-line calc(var(--wavelo-duration,1s) * 2.2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}

/* 1. Ursa Major / Big Dipper (default) */
.wavelo--constellation:not([data-wavelo-constellation]) .wavelo__part:nth-child(1),.wavelo--constellation[data-wavelo-constellation="ursa-major"] .wavelo__part:nth-child(1){left:10%;top:28%;width:10%;height:10%}
.wavelo--constellation:not([data-wavelo-constellation]) .wavelo__part:nth-child(2),.wavelo--constellation[data-wavelo-constellation="ursa-major"] .wavelo__part:nth-child(2){left:24%;top:38%;width:9%;height:9%;animation-delay:calc(var(--wavelo-duration,1s) * -.3)}
.wavelo--constellation:not([data-wavelo-constellation]) .wavelo__part:nth-child(3),.wavelo--constellation[data-wavelo-constellation="ursa-major"] .wavelo__part:nth-child(3){left:40%;top:44%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -.6)}
.wavelo--constellation:not([data-wavelo-constellation]) .wavelo__part:nth-child(4),.wavelo--constellation[data-wavelo-constellation="ursa-major"] .wavelo__part:nth-child(4){left:56%;top:48%;width:8%;height:8%;animation-delay:calc(var(--wavelo-duration,1s) * -.9)}
.wavelo--constellation:not([data-wavelo-constellation]) .wavelo__part:nth-child(5),.wavelo--constellation[data-wavelo-constellation="ursa-major"] .wavelo__part:nth-child(5){left:58%;top:78%;width:9%;height:9%;animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--constellation:not([data-wavelo-constellation]) .wavelo__part:nth-child(6),.wavelo--constellation[data-wavelo-constellation="ursa-major"] .wavelo__part:nth-child(6){left:84%;top:72%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -1.5)}
.wavelo--constellation:not([data-wavelo-constellation]) .wavelo__part:nth-child(7),.wavelo--constellation[data-wavelo-constellation="ursa-major"] .wavelo__part:nth-child(7){left:82%;top:40%;width:11%;height:11%;animation-delay:calc(var(--wavelo-duration,1s) * -1.8)}
.wavelo--constellation:not([data-wavelo-constellation]):before,.wavelo--constellation[data-wavelo-constellation="ursa-major"]:before{clip-path:polygon(10% 28%,24% 38%,40% 44%,56% 48%,82% 40%,84% 72%,58% 78%,56% 48%,56% 50%,58% 80%,84% 74%,82% 42%,56% 50%,40% 46%,24% 40%,10% 30%)}
.wavelo--constellation:not([data-wavelo-constellation]):after,.wavelo--constellation[data-wavelo-constellation="ursa-major"]:after{display:none}

/* 2. Orion (The Hunter) */
.wavelo--constellation[data-wavelo-constellation="orion"] .wavelo__part:nth-child(1){left:22%;top:16%;width:13%;height:13%;box-shadow:0 0 7px #f97316,0 0 10px #ea580c}
.wavelo--constellation[data-wavelo-constellation="orion"] .wavelo__part:nth-child(2){left:78%;top:22%;width:11%;height:11%;animation-delay:calc(var(--wavelo-duration,1s) * -.4)}
.wavelo--constellation[data-wavelo-constellation="orion"] .wavelo__part:nth-child(3){left:38%;top:49%;width:9%;height:9%;animation-delay:calc(var(--wavelo-duration,1s) * -.8)}
.wavelo--constellation[data-wavelo-constellation="orion"] .wavelo__part:nth-child(4){left:50%;top:48%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -1.1)}
.wavelo--constellation[data-wavelo-constellation="orion"] .wavelo__part:nth-child(5){left:62%;top:47%;width:9%;height:9%;animation-delay:calc(var(--wavelo-duration,1s) * -1.4)}
.wavelo--constellation[data-wavelo-constellation="orion"] .wavelo__part:nth-child(6){left:28%;top:82%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -1.7)}
.wavelo--constellation[data-wavelo-constellation="orion"] .wavelo__part:nth-child(7){left:76%;top:78%;width:12%;height:12%;box-shadow:0 0 7px #38bdf8,0 0 10px #0284c7;animation-delay:calc(var(--wavelo-duration,1s) * -.2)}
.wavelo--constellation[data-wavelo-constellation="orion"]:before{clip-path:polygon(22% 16%,78% 22%,62% 47%,76% 78%,28% 82%,38% 49%,22% 16%,22% 18%,38% 51%,28% 84%,76% 80%,62% 49%,78% 24%,22% 18%)}
.wavelo--constellation[data-wavelo-constellation="orion"]:after{clip-path:polygon(38% 49%,50% 48%,62% 47%,62% 49%,50% 50%,38% 51%)}

/* 3. Cassiopeia (The Queen - "W") */
.wavelo--constellation[data-wavelo-constellation="cassiopeia"] .wavelo__part:nth-child(1){left:12%;top:32%;width:9%;height:9%}
.wavelo--constellation[data-wavelo-constellation="cassiopeia"] .wavelo__part:nth-child(2){left:32%;top:74%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -.4)}
.wavelo--constellation[data-wavelo-constellation="cassiopeia"] .wavelo__part:nth-child(3){left:52%;top:36%;width:12%;height:12%;animation-delay:calc(var(--wavelo-duration,1s) * -.8)}
.wavelo--constellation[data-wavelo-constellation="cassiopeia"] .wavelo__part:nth-child(4){left:72%;top:70%;width:11%;height:11%;animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--constellation[data-wavelo-constellation="cassiopeia"] .wavelo__part:nth-child(5){left:90%;top:22%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -1.6)}
.wavelo--constellation[data-wavelo-constellation="cassiopeia"] .wavelo__part:nth-child(n+6){display:none}
.wavelo--constellation[data-wavelo-constellation="cassiopeia"]:before{clip-path:polygon(12% 32%,32% 74%,52% 36%,72% 70%,90% 22%,90% 24%,72% 72%,52% 38%,32% 76%,12% 34%)}
.wavelo--constellation[data-wavelo-constellation="cassiopeia"]:after{display:none}

/* 4. Cygnus (The Northern Cross) */
.wavelo--constellation[data-wavelo-constellation="cygnus"] .wavelo__part:nth-child(1){left:50%;top:12%;width:13%;height:13%;box-shadow:0 0 8px currentColor}
.wavelo--constellation[data-wavelo-constellation="cygnus"] .wavelo__part:nth-child(2){left:50%;top:46%;width:11%;height:11%;animation-delay:calc(var(--wavelo-duration,1s) * -.4)}
.wavelo--constellation[data-wavelo-constellation="cygnus"] .wavelo__part:nth-child(3){left:50%;top:88%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -.8)}
.wavelo--constellation[data-wavelo-constellation="cygnus"] .wavelo__part:nth-child(4){left:14%;top:46%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--constellation[data-wavelo-constellation="cygnus"] .wavelo__part:nth-child(5){left:86%;top:46%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -1.6)}
.wavelo--constellation[data-wavelo-constellation="cygnus"] .wavelo__part:nth-child(n+6){display:none}
.wavelo--constellation[data-wavelo-constellation="cygnus"]:before{clip-path:polygon(49% 12%,51% 12%,51% 88%,49% 88%)}
.wavelo--constellation[data-wavelo-constellation="cygnus"]:after{clip-path:polygon(14% 45%,86% 45%,86% 47%,14% 47%)}

/* 5. Ursa Minor (The Little Dipper & Polaris) */
.wavelo--constellation[data-wavelo-constellation="ursa-minor"] .wavelo__part:nth-child(1){left:14%;top:22%;width:14%;height:14%;box-shadow:0 0 8px currentColor,0 0 12px currentColor}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"] .wavelo__part:nth-child(2){left:32%;top:32%;width:8%;height:8%;animation-delay:calc(var(--wavelo-duration,1s) * -.3)}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"] .wavelo__part:nth-child(3){left:48%;top:44%;width:8%;height:8%;animation-delay:calc(var(--wavelo-duration,1s) * -.6)}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"] .wavelo__part:nth-child(4){left:64%;top:50%;width:8%;height:8%;animation-delay:calc(var(--wavelo-duration,1s) * -.9)}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"] .wavelo__part:nth-child(5){left:86%;top:48%;width:11%;height:11%;animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"] .wavelo__part:nth-child(6){left:84%;top:76%;width:10%;height:10%;animation-delay:calc(var(--wavelo-duration,1s) * -1.5)}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"] .wavelo__part:nth-child(7){left:62%;top:74%;width:8%;height:8%;animation-delay:calc(var(--wavelo-duration,1s) * -1.8)}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"]:before{clip-path:polygon(14% 22%,32% 32%,48% 44%,64% 50%,86% 48%,84% 76%,62% 74%,64% 50%,64% 52%,62% 76%,84% 78%,86% 50%,64% 52%,48% 46%,32% 34%,14% 24%)}
.wavelo--constellation[data-wavelo-constellation="ursa-minor"]:after{display:none}
${fadeDotFrames}${altDotFrames}${altDotReverseFrames}${staggerDotFrames}${typingDotFrames}${tripFrames}${neuralFrames}${magnetFrames}${pendulumFrames}${bubbleFrames}${constellationFrames}${constellationLineFrames}${dotRingFrames}`;
