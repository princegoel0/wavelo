import { css as radarFrames } from '../keyframes/radar.js';
import { css as glowFrames } from '../keyframes/glow.js';
import { css as rubberFrames } from '../keyframes/rubber.js';
import { css as snakeFrames } from '../keyframes/snake.js';
import { css as ellipseFrames } from '../keyframes/ellipse.js';
import { css as checkFrames } from '../keyframes/check.js';

export const ringCss = `
.wavelo--ring{border:var(--wavelo-stroke,3px) solid currentColor;border-right-color:transparent;border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* border-image is not clipped by border-radius, so the gradient this design used to draw
   its border came out as a square outline with rounded corners on nothing. The ring is
   carved from a gradient fill by a radial mask instead, which is how the conic ring
   already works, and the inherited spin turns the sweep round. */
.wavelo--gradient-ring{border:0;background:linear-gradient(currentColor,var(--wavelo-secondary-color,#a5b4fc));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)))}
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
/* A rubber band is a loop, so it cannot have a side missing — the inherited open border
   made this a wobbling C. Closed, and the deformation is now a pluck: stretched tall,
   snapped back past flat, two shrinking overshoots, and a rest, so each cycle reads as
   one release rather than a continuous wobble. */
.wavelo--rubber-band{border-color:currentColor;animation:wavelo-rubber calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A short arc chasing its own tail: it turns while it shrinks and turns back out, so
   the open end appears to swallow the ring and then release it. */
/* The snake game: a bordered room and five segments chasing each other around its
   perimeter. Every segment runs the same path a fifth of a cycle behind the last, so the
   body follows the head through all four corners and the tail is always where the head
   was. The travel is inset by the border and by the segment's own width, because the
   parts are placed in the content box, not over the frame. */
.wavelo--snake{border:var(--wavelo-stroke,3px) solid color-mix(in srgb,currentColor 22%,transparent);border-radius:var(--wavelo-radius,6px);background:transparent;animation:none}
.wavelo--snake .wavelo__part{position:absolute;left:0;top:0;width:18%;height:18%;border-radius:50%;background:currentColor;transform-origin:center;animation:wavelo-snake calc(var(--wavelo-duration,1s) * 6) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--snake .wavelo__part:first-child{animation-delay:calc(var(--wavelo-duration,1s) * -.96);z-index:5;box-shadow:0 0 6px color-mix(in srgb,currentColor 35%,transparent)}
.wavelo--snake .wavelo__part:first-child:after{content:"";position:absolute;right:18%;top:20%;width:22%;height:60%;background:radial-gradient(circle at 50% 25%,#fff 0 35%,#0b1020 40%),radial-gradient(circle at 50% 75%,#fff 0 35%,#0b1020 40%)}
.wavelo--snake .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.72);z-index:4}
.wavelo--snake .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.48);width:17%;height:17%;z-index:3}
.wavelo--snake .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.24);width:15%;height:15%;opacity:.9;z-index:2}
.wavelo--snake .wavelo__part:nth-child(5){animation-delay:0s;width:13%;height:13%;opacity:.75;z-index:1}
/* Two hands on one dial. The minute hand turns with the duration and the hour hand is
   the same sweep twelve times slower, which is what makes it read as a clock rather
   than a spinner. */
/* Two hands needed a dial to be a clock: without one they were two bars sweeping in
   empty space. The face is a faint ring at 22% so it never competes with the hands, and
   the four markers are background layers, which costs no element. */
.wavelo--clock-spinner{border:var(--wavelo-stroke,3px) solid color-mix(in srgb,currentColor 22%,transparent);background:radial-gradient(circle at 50% 7%,currentColor 0 4.5%,transparent 4.5%),radial-gradient(circle at 93% 50%,currentColor 0 4.5%,transparent 4.5%),radial-gradient(circle at 50% 93%,currentColor 0 4.5%,transparent 4.5%),radial-gradient(circle at 7% 50%,currentColor 0 4.5%,transparent 4.5%);animation:none}
.wavelo--clock-spinner:before,.wavelo--clock-spinner:after{content:"";position:absolute;left:50%;bottom:50%;width:var(--wavelo-stroke,2px);border-radius:var(--wavelo-radius,2px);background:currentColor;transform-origin:50% 100%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--clock-spinner:before{height:38%}
.wavelo--clock-spinner:after{height:26%;background:var(--wavelo-secondary-color,#a5b4fc);animation-duration:calc(var(--wavelo-duration,1s) * 12)}
.wavelo--success-ring{border:var(--wavelo-stroke,3px) solid var(--wavelo-secondary-color,color-mix(in srgb,currentColor 22%,transparent));border-top-color:currentColor;border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);position:relative}
.wavelo--success-ring:after{content:"";position:absolute;box-sizing:border-box;left:28%;top:18%;width:35%;height:55%;border-right:var(--wavelo-stroke,3px) solid #22c55e;border-bottom:var(--wavelo-stroke,3px) solid #22c55e;transform:scale(0) rotate(45deg);opacity:0;transition:transform .2s ease,opacity .2s ease}
.wavelo--success-ring[data-wavelo-state="success"]{border-color:#22c55e;animation:none}
.wavelo--success-ring[data-wavelo-state="success"]:after{opacity:1;transform:scale(1) rotate(45deg);animation:wavelo-check calc(var(--wavelo-duration,1s) * .4) cubic-bezier(.175,.885,.32,1.275) forwards}
.wavelo--success-ring[data-wavelo-state="error"]{border-color:#ef4444;animation:none}
.wavelo--success-ring[data-wavelo-state="idle"]{border-color:color-mix(in srgb,currentColor 35%,transparent);animation:none}
${radarFrames}${glowFrames}${rubberFrames}${snakeFrames}${ellipseFrames}${checkFrames}`;
