import { css as equalizerFrames } from '../keyframes/equalizer.js';
import { css as fadeBarFrames } from '../keyframes/fade-bar.js';
import { css as growBarFrames } from '../keyframes/grow-bar.js';
import { css as pianoFrames } from '../keyframes/piano.js';
import { css as fireFrames } from '../keyframes/fire.js';

export const barsCss = `
.wavelo--bars{align-items:flex-end;gap:var(--wavelo-gap,3px)}
.wavelo--bars .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 8);height:70%;border-radius:var(--wavelo-radius,2px)}
.wavelo--bars .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -5)}
.wavelo--bars .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 5)}
.wavelo--bars .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -3 / 5)}
.wavelo--bars .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -4 / 5)}

.wavelo--fading-bars .wavelo__part{animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--growing-bars .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(odd){height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(even){animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Piano keys: the same fall-and-rise at four different points in the cycle, so the
   bars do not sweep as a wave but land one after another. */
.wavelo--piano-keys .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-piano calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--piano-keys .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.28)}
.wavelo--piano-keys .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.84)}
.wavelo--piano-keys .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1.12)}
.wavelo--piano-keys .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.56)}
/* A fire: each bar rises, stretches and burns out at the top, on offsets uneven enough
   that the row never beats together. */
.wavelo--fire-rise .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-fire calc(var(--wavelo-duration,1s) * 1.2) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fire-rise .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.17)}
.wavelo--fire-rise .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.43)}
.wavelo--fire-rise .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.61)}
.wavelo--fire-rise .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.89)}
${equalizerFrames}${fadeBarFrames}${growBarFrames}${pianoFrames}${fireFrames}`;
