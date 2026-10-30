import { css as radarFrames } from '../keyframes/radar.js';
import { css as glowFrames } from '../keyframes/glow.js';
import { css as rubberFrames } from '../keyframes/rubber.js';
import { css as snakeFrames } from '../keyframes/snake.js';
import { css as ellipseFrames } from '../keyframes/ellipse.js';

export const ringCss = `
.wavelo--ring{border:var(--wavelo-stroke,3px) solid currentColor;border-right-color:transparent;border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--gradient-ring{border-image:linear-gradient(currentColor,var(--wavelo-secondary-color,#a5b4fc)) 1;border-radius:50%}
.wavelo--half-circle{border-bottom-color:transparent}
/* An ellipse, and it has to look like one. It inherits the ring's open side, which made
   this a squashed "C" spinning flat — a gap, not an ellipse. The border is closed and the
   turn is about the vertical axis with perspective, so the hoop foreshortens through the
   cycle the way a ring tilted in space does. */
.wavelo--ellipse{width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:calc(var(--wavelo-height,var(--wavelo-size,2.5rem)) / 2);border-color:currentColor;animation:wavelo-ellipse calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--radar{border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 300deg,currentColor 355deg,transparent);animation:wavelo-radar var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--spiral{background:conic-gradient(transparent 0 20deg,currentColor 25deg 35deg,transparent 40deg 80deg,currentColor 85deg 95deg,transparent 100deg);border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--circular{border-color:currentColor}
.wavelo--circular:before{content:"";position:absolute;inset:calc(var(--wavelo-stroke,3px) * -1);border:var(--wavelo-stroke,3px) solid transparent;border-top-color:var(--wavelo-secondary-color,#a5b4fc);border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--thin-line{border-width:1px}
.wavelo--thick-stroke{border-width:calc(var(--wavelo-stroke,3px) * 2.5)}
.wavelo--arc{border-color:transparent;border-top-color:currentColor}
.wavelo--segmented-ring{border-style:dashed;border-right-color:currentColor}
.wavelo--monochrome{border:0;background:conic-gradient(currentColor 0 50%,color-mix(in srgb,currentColor 22%,transparent) 50% 100%);border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A conic sweep carved into a ring by a radial mask, so the stroke width is the ring
   and the gradient is the motion. No border is drawn here. The prefixed mask is for
   the declared floor: the unprefixed mask shorthand landed after Chrome 111. */
.wavelo--conic-ring{border:0;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 55%,color-mix(in srgb,currentColor 28%,transparent) 70%,currentColor 92%,transparent);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* The same ring, but lit: it turns and throws a glow that swells and fades. */
.wavelo--neon-ring{animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running),wavelo-glow calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Elastic: the ring holds still and the stroke travels instead, squashing along one
   axis and stretching along the other. */
.wavelo--rubber-band{animation:wavelo-rubber calc(var(--wavelo-duration,1s) * 1.2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A short arc chasing its own tail: it turns while it shrinks and turns back out, so
   the open end appears to swallow the ring and then release it. */
.wavelo--snake{border-color:transparent;border-top-color:currentColor;border-right-color:currentColor;animation:wavelo-snake var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Two hands on one dial. The minute hand turns with the duration and the hour hand is
   the same sweep twelve times slower, which is what makes it read as a clock rather
   than a spinner. */
.wavelo--clock-spinner{border:0;background:transparent;animation:none}
.wavelo--clock-spinner:before,.wavelo--clock-spinner:after{content:"";position:absolute;left:50%;bottom:50%;width:var(--wavelo-stroke,2px);border-radius:var(--wavelo-radius,2px);background:currentColor;transform-origin:50% 100%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--clock-spinner:before{height:38%}
.wavelo--clock-spinner:after{height:26%;background:var(--wavelo-secondary-color,#a5b4fc);animation-duration:calc(var(--wavelo-duration,1s) * 12)}
${radarFrames}${glowFrames}${rubberFrames}${snakeFrames}${ellipseFrames}`;
