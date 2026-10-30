import { css as orbitFrames } from '../keyframes/orbit.js';
import { css as cometTailFrames } from '../keyframes/comet-tail.js';
import { css as fireflyFrames } from '../keyframes/firefly.js';
import { css as orbitRingFrames } from '../keyframes/orbit-ring.js';

export const orbitCss = `
.wavelo--orbit .wavelo__part{position:absolute;width:25%;height:25%;border-radius:50%;transform-origin:200% 200%;animation:wavelo-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--orbit .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--orbit .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--orbit{display:block;background:transparent}
.wavelo--orbit.wavelo-inline{display:inline-block}
.wavelo--orbit .wavelo__part{position:absolute;left:50%;top:50%;width:18%;height:18%;transform-origin:0 0;animation:wavelo-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--orbit .wavelo__part:nth-child(1){--orbit-angle:0deg}
.wavelo--orbit .wavelo__part:nth-child(2){--orbit-angle:72deg}
.wavelo--orbit .wavelo__part:nth-child(3){--orbit-angle:144deg}
.wavelo--orbit .wavelo__part:nth-child(4){--orbit-angle:216deg}
.wavelo--orbit .wavelo__part:nth-child(5){--orbit-angle:288deg}
.wavelo--orbiting-circles .wavelo__part{width:25%;height:25%;background:transparent;border:var(--wavelo-stroke,3px) solid currentColor}
.wavelo--particle-orbit .wavelo__part{width:10%;height:10%;box-shadow:0 0 0 2px color-mix(in srgb,currentColor 30%,transparent)}
.wavelo--rotating-dots .wavelo__part{animation:wavelo-dot-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* The ring is one radius wide and the dots ride it a fifth of a turn apart; without the
   stagger every dot is at the same point of the same circle, which renders as one blob. */
.wavelo--rotating-dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.2)}
.wavelo--rotating-dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.4)}
.wavelo--rotating-dots .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.6)}
.wavelo--rotating-dots .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.8)}
/* One head on a mask-carved conic sweep: the arc fades out behind it and both turn
   together, so the tail always trails the dot. The mask lives on the tail layer, so
   the head is not carved along with it, and the prefixed copy is there because the
   unprefixed mask shorthand is newer than the declared browser floor. */
/* The tail and the dot used to spin about different centres — the pseudo about its own
   middle, the dot about a point 90% to its left — so the head slid away from the tail and
   the design showed a crescent with an unrelated dot drifting past it. The spin now lives
   on the root and both are placed inside it, so they turn as one object by construction.
   The dot sits on the ring's mid-line at twelve o'clock, which is where the conic reaches
   full strength, and the fade is a long ramp rather than two hard stops. */
.wavelo--comet-orbit{display:block;background:transparent;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--comet-orbit.wavelo-inline{display:inline-block}
.wavelo--comet-orbit:before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 26%,color-mix(in srgb,currentColor 8%,transparent) 48%,color-mix(in srgb,currentColor 42%,transparent) 76%,currentColor 99%,transparent);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));animation:wavelo-comet-tail calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--comet-orbit .wavelo__part{left:50%;top:calc(var(--wavelo-stroke,3px) / 2 - var(--wavelo-size,2.5rem) * .09);margin-left:calc(var(--wavelo-size,2.5rem) * -.09);width:18%;height:18%;animation:none}
/* Six motes drifting on uneven paths and fading as they go, so the group never beats
   as one. */
.wavelo--fireflies .wavelo__part{width:9%;height:9%;animation:wavelo-firefly calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fireflies .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.5)}
.wavelo--fireflies .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -1.1)}
.wavelo--fireflies .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1.7)}
.wavelo--fireflies .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -2.2)}
.wavelo--fireflies .wavelo__part:nth-child(6){animation-delay:calc(var(--wavelo-duration,1s) * -2.7)}
/* Three orbits at three radii around a sun. The turn is the same shape at every
   distance; only the radius and the period differ, which is what a solar system looks
   like rather than a ring of dots. */
.wavelo--solar-system:before{content:"";position:absolute;left:50%;top:50%;width:20%;height:20%;margin:-10% 0 0 -10%;border-radius:50%;background:var(--wavelo-secondary-color,#a5b4fc)}
.wavelo--solar-system .wavelo__part{width:8%;height:8%;animation:wavelo-orbit-ring calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--solar-system .wavelo__part:nth-child(1){--angle:0deg;--radius:.18;animation-duration:calc(var(--wavelo-duration,1s) * .8)}
.wavelo--solar-system .wavelo__part:nth-child(2){--angle:120deg;--radius:.3;animation-duration:calc(var(--wavelo-duration,1s) * 1.6)}
.wavelo--solar-system .wavelo__part:nth-child(3){--angle:240deg;--radius:.42;animation-duration:calc(var(--wavelo-duration,1s) * 2.6)}
${orbitFrames}${cometTailFrames}${fireflyFrames}${orbitRingFrames}`;
