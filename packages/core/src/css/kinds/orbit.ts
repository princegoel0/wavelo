import { css as orbitFrames } from '../keyframes/orbit.js';
import { css as cometTailFrames } from '../keyframes/comet-tail.js';
import { css as fireflyFrames } from '../keyframes/firefly.js';
import { css as orbitRingFrames } from '../keyframes/orbit-ring.js';

export const orbitCss = `
.wavelo--orbit{display:block;background:transparent}
.wavelo--orbit.wavelo-inline{display:inline-block}
.wavelo--orbit .wavelo__part{position:absolute;left:50%;top:50%;width:18%;height:18%;border-radius:50%;transform-origin:0 0;animation:wavelo-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--orbit .wavelo__part:nth-child(1){--orbit-angle:0deg}
.wavelo--orbit .wavelo__part:nth-child(2){--orbit-angle:72deg}
.wavelo--orbit .wavelo__part:nth-child(3){--orbit-angle:144deg}
.wavelo--orbit .wavelo__part:nth-child(4){--orbit-angle:216deg}
.wavelo--orbit .wavelo__part:nth-child(5){--orbit-angle:288deg}
.wavelo--orbiting-dots:before,.wavelo--orbiting-circles:before{content:"";position:absolute;left:50%;top:50%;width:12%;height:12%;margin:-6% 0 0 -6%;border-radius:50%;background:color-mix(in srgb,currentColor 35%,transparent)}
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
/* Ten motes drifting on uneven paths and glowing as they go, with natural firefly bioluminescence. */
.wavelo--fireflies .wavelo__part{width:8%;height:8%;border-radius:50%;box-shadow:0 0 5px currentColor,0 0 8px color-mix(in srgb,currentColor 50%,transparent);animation:wavelo-firefly calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fireflies .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.3)}
.wavelo--fireflies .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.6)}
.wavelo--fireflies .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.9)}
.wavelo--fireflies .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--fireflies .wavelo__part:nth-child(6){animation-delay:calc(var(--wavelo-duration,1s) * -1.5)}
.wavelo--fireflies .wavelo__part:nth-child(7){animation-delay:calc(var(--wavelo-duration,1s) * -1.8)}
.wavelo--fireflies .wavelo__part:nth-child(8){animation-delay:calc(var(--wavelo-duration,1s) * -2.1)}
.wavelo--fireflies .wavelo__part:nth-child(9){animation-delay:calc(var(--wavelo-duration,1s) * -2.4)}
.wavelo--fireflies .wavelo__part:nth-child(10){animation-delay:calc(var(--wavelo-duration,1s) * -2.7)}
/* The Solar System: central Sun, concentric orbital rings, and planets orbiting in Keplerian resonance. */
.wavelo--solar-system{background:radial-gradient(circle,transparent 15%,color-mix(in srgb,currentColor 14%,transparent) 15.5%,transparent 16.5%,transparent 23%,color-mix(in srgb,currentColor 14%,transparent) 23.5%,transparent 24.5%,transparent 31%,color-mix(in srgb,currentColor 14%,transparent) 31.5%,transparent 32.5%,transparent 38%,color-mix(in srgb,currentColor 14%,transparent) 38.5%,transparent 39.5%,transparent 45%,color-mix(in srgb,currentColor 14%,transparent) 45.5%,transparent 46.5%)}
.wavelo--solar-system:before{content:"";position:absolute;left:50%;top:50%;width:20%;height:20%;margin:-10% 0 0 -10%;border-radius:50%;background:radial-gradient(circle,var(--wavelo-secondary-color,#fbbf24) 40%,color-mix(in srgb,currentColor 80%,transparent) 80%);box-shadow:0 0 6px var(--wavelo-secondary-color,#fbbf24)}
.wavelo--solar-system .wavelo__part{border-radius:50%;animation:wavelo-orbit-ring calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--solar-system .wavelo__part:nth-child(1){width:5%;height:5%;--angle:40deg;--radius:.16;animation-duration:calc(var(--wavelo-duration,1s) * .6)}
.wavelo--solar-system .wavelo__part:nth-child(2){width:7%;height:7%;--angle:160deg;--radius:.24;animation-duration:calc(var(--wavelo-duration,1s) * 1.1)}
.wavelo--solar-system .wavelo__part:nth-child(3){width:8%;height:8%;--angle:290deg;--radius:.32;animation-duration:calc(var(--wavelo-duration,1s) * 1.6)}
.wavelo--solar-system .wavelo__part:nth-child(4){width:6%;height:6%;--angle:80deg;--radius:.39;animation-duration:calc(var(--wavelo-duration,1s) * 2.2)}
.wavelo--solar-system .wavelo__part:nth-child(5){width:9%;height:9%;--angle:210deg;--radius:.46;animation-duration:calc(var(--wavelo-duration,1s) * 3);position:relative}
.wavelo--solar-system .wavelo__part:nth-child(5):after{content:"";position:absolute;inset:-2px -4px;border:1.5px solid currentColor;border-radius:50%;transform:rotate(-25deg)}
${orbitFrames}${cometTailFrames}${fireflyFrames}${orbitRingFrames}`;
