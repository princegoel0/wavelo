import { css as orbitFrames } from '../keyframes/orbit.js';
import { css as cometTailFrames } from '../keyframes/comet-tail.js';

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
/* One head on a mask-carved conic sweep: the arc fades out behind it and both turn
   together, so the tail always trails the dot. The mask lives on the tail layer, so
   the head is not carved along with it, and the prefixed copy is there because the
   unprefixed mask shorthand is newer than the declared browser floor. */
.wavelo--comet-orbit{display:block;background:transparent}
.wavelo--comet-orbit.wavelo-inline{display:inline-block}
.wavelo--comet-orbit:before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 40%,color-mix(in srgb,currentColor 25%,transparent) 62%,currentColor 90%,transparent);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running),wavelo-comet-tail calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--comet-orbit .wavelo__part{left:auto;top:auto;right:2%;width:18%;height:18%;transform-origin:-90% 50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${orbitFrames}${cometTailFrames}`;
