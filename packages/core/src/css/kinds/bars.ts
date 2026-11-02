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
/* equalizer is countable: the wave's phase and each bar's width divide by the number of
   tracks, so a seven- or eight-bar row travels instead of leaving a tail of un-phased
   bars. At the default of five this is the same quarter-phase the rules above give. */
.wavelo--equalizer .wavelo__part:nth-child(n){width:calc(var(--wavelo-size,2.5rem) * 5 / (8 * var(--wavelo-parts,5)));animation-delay:calc(var(--wavelo-duration,1s) / var(--wavelo-parts,5) * var(--i,0) * -1)}
.wavelo--equalizer .wavelo__part:nth-child(2){--i:1}
.wavelo--equalizer .wavelo__part:nth-child(3){--i:2}
.wavelo--equalizer .wavelo__part:nth-child(4){--i:3}
.wavelo--equalizer .wavelo__part:nth-child(5){--i:4}
.wavelo--equalizer .wavelo__part:nth-child(6){--i:5}
.wavelo--equalizer .wavelo__part:nth-child(7){--i:6}
.wavelo--equalizer .wavelo__part:nth-child(8){--i:7}
.wavelo--equalizer .wavelo__part:nth-child(9){--i:8}
.wavelo--equalizer .wavelo__part:nth-child(10){--i:9}
.wavelo--equalizer .wavelo__part:nth-child(11){--i:10}
.wavelo--equalizer .wavelo__part:nth-child(12){--i:11}
.wavelo--equalizer .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-equalizer var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--equalizer .wavelo__part:nth-child(even){background:var(--wavelo-secondary-color,currentColor)}
.wavelo--fading-bars .wavelo__part{animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--growing-bars .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(odd){height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(even){background:var(--wavelo-secondary-color,currentColor);animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Piano keys: the same fall-and-rise at four different points in the cycle, so the
   bars do not sweep as a wave but land one after another. */
.wavelo--piano-keys .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-piano calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--piano-keys .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.28)}
.wavelo--piano-keys .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.84)}
.wavelo--piano-keys .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1.12)}
.wavelo--piano-keys .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.56)}
/* A fire: each bar rises, stretches and burns out at the top, on offsets uneven enough
   that the row never beats together. */
.wavelo--fire-rise{position:relative;width:var(--wavelo-width,var(--wavelo-size,2.75rem));height:var(--wavelo-height,var(--wavelo-size,2.75rem));margin:auto;align-items:flex-end;justify-content:center;gap:3.5px}
.wavelo--fire-rise:before{content:"";position:absolute;bottom:0;left:10%;right:10%;height:3px;border-radius:9999px;background:radial-gradient(ellipse at center,#fde047 0%,var(--wavelo-secondary-color,#f97316) 65%,transparent 100%);box-shadow:0 0 12px var(--wavelo-secondary-color,#f97316),0 -2px 6px #ef4444;z-index:1}
.wavelo--fire-rise .wavelo__part{transform-origin:50% 100%;border-radius:6px 6px 2px 2px;background:linear-gradient(to top,#ef4444 0%,var(--wavelo-secondary-color,#f97316) 40%,#fbbf24 75%,#ffffff 100%);filter:drop-shadow(0 -2px 6px rgba(249,115,22,.7));animation:wavelo-fire calc(var(--wavelo-duration,1s) * 1.1) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fire-rise .wavelo__part:nth-child(1){width:5px;height:75%;animation-delay:calc(var(--wavelo-duration,1s) * -.75)}
.wavelo--fire-rise .wavelo__part:nth-child(2){width:7px;height:90%;animation-delay:calc(var(--wavelo-duration,1s) * -.2)}
.wavelo--fire-rise .wavelo__part:nth-child(3){width:8px;height:100%;animation-delay:0s}
.wavelo--fire-rise .wavelo__part:nth-child(4){width:6.5px;height:85%;animation-delay:calc(var(--wavelo-duration,1s) * -.45)}
.wavelo--fire-rise .wavelo__part:nth-child(5){width:5px;height:70%;animation-delay:calc(var(--wavelo-duration,1s) * -.9)}




${equalizerFrames}${fadeBarFrames}${growBarFrames}${pianoFrames}${fireFrames}`;
