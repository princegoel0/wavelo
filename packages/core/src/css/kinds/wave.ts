import { css as highlightFrames } from '../keyframes/highlight.js';
import { css as stripeFrames } from '../keyframes/stripe.js';
import { css as waveFrames } from '../keyframes/wave.js';
import { css as dotWaveFrames } from '../keyframes/dot-wave.js';
import { css as waveformFrames } from '../keyframes/waveform.js';
import { css as waveformReverseFrames } from '../keyframes/waveform-reverse.js';
import { css as horizontalPulseFrames } from '../keyframes/horizontal-pulse.js';
import { css as helixFrames } from '../keyframes/helix.js';
import { css as helixRungFrames } from '../keyframes/helix-rung.js';
import { css as tokenFrames } from '../keyframes/token.js';
import { css as generateFrames } from '../keyframes/generate.js';
import { css as heartFrames } from '../keyframes/heart.js';
import { css as breatheFrames } from '../keyframes/breathe.js';

export const waveCss = `
.wavelo--wave{gap:var(--wavelo-gap,3px)}
.wavelo--wave .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 8);height:70%;border-radius:var(--wavelo-radius,2px);animation:wavelo-wave var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--moving-stripe,.wavelo--traveling-highlight{background:repeating-linear-gradient(45deg,currentColor 0 8px,transparent 8px 16px);animation:wavelo-stripe var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--traveling-highlight{background:linear-gradient(90deg,transparent,currentColor,transparent);animation:wavelo-highlight var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--oscillating-line{height:var(--wavelo-stroke,3px);background:currentColor;animation:wavelo-wave var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--horizontal-pulse-bars .wavelo__part{animation:wavelo-horizontal-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--multi-wave .wavelo__part:nth-child(odd){animation:wavelo-waveform var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--multi-wave .wavelo__part:nth-child(even){animation:wavelo-waveform-reverse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A helix is taller than it is wide, so the box is two sizes tall, written as the
   fallback of --wavelo-height so an explicit height still wins. Nodes take their width
   from the box and their height from aspect-ratio: a percentage height here would be
   measured against the taller box and the dots would come out elliptical. */
.wavelo--helix{display:block;background:transparent;height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem) * 2))}
/* Eighteen parts: six rows of three, each row rung, far node, near node in that paint
   order, so the near strand always lies over the far one and both lie over their base
   pair. --r carries the row's phase, a fifth of a turn apart down the box, which is what
   makes the swing read as a twist travelling downward rather than six dots in a line. */
.wavelo--helix .wavelo__part{position:absolute;left:50%;width:13%;height:auto;aspect-ratio:1;margin-left:-6.5%;border-radius:50%;animation:wavelo-helix var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,1s) * var(--r))}
.wavelo--helix .wavelo__part:nth-child(-n+3){top:8%;--r:0}
.wavelo--helix .wavelo__part:nth-child(n+4):nth-child(-n+6){top:24%;--r:-.2}
.wavelo--helix .wavelo__part:nth-child(n+7):nth-child(-n+9){top:40%;--r:-.4}
.wavelo--helix .wavelo__part:nth-child(n+10):nth-child(-n+12){top:56%;--r:-.6}
.wavelo--helix .wavelo__part:nth-child(n+13):nth-child(-n+15){top:72%;--r:-.8}
.wavelo--helix .wavelo__part:nth-child(n+16){top:88%;--r:-1}
/* Half a turn behind its own pair, smaller and dimmer: that is what makes one strand
   read as the one curving away behind the other. */
.wavelo--helix .wavelo__part:nth-child(3n+2){width:9%;margin-left:-4.5%;opacity:.4;animation-delay:calc(var(--wavelo-duration,1s) * (var(--r) - .5))}
/* A base pair spans the two extremes its nodes swing between, and closes to nothing as
   they cross — twice a turn, which is why this keyframe runs at double frequency. */
.wavelo--helix .wavelo__part:nth-child(3n+1){width:64%;height:var(--wavelo-stroke,3px);margin-left:-32%;border-radius:var(--wavelo-radius,999px);opacity:.6;animation-name:wavelo-helix-rung}
/* Tokens arriving: five short dashes light up at the left, travel right and dim, each
   a fifth of a cycle behind the last, so the row reads as output being appended. */
.wavelo--token-stream{gap:var(--wavelo-gap,3px);justify-content:flex-start}
.wavelo--token-stream .wavelo__part{width:18%;height:calc(var(--wavelo-stroke,3px) * 1.5);border-radius:var(--wavelo-radius,1px);animation:wavelo-token calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--token-stream .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.32)}
.wavelo--token-stream .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.64)}
.wavelo--token-stream .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.96)}
.wavelo--token-stream .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -1.28)}
/* Generation has no percentage to show, so it says so: a bright band travels an empty
   track. Indeterminate on purpose, which is why it is a wave-kind design rather than a
   progress one — it must not advertise a value it cannot draw. */
.wavelo--progress-ai-generate{width:var(--wavelo-width,var(--wavelo-size,8rem));height:var(--wavelo-height,.5rem);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 15%,transparent);overflow:hidden}
.wavelo--progress-ai-generate .wavelo__part{width:45%;height:100%;border-radius:inherit;background:linear-gradient(90deg,transparent,var(--wavelo-secondary-color,#a5b4fc),currentColor,var(--wavelo-secondary-color,#a5b4fc),transparent);animation:wavelo-generate calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* An ECG trace. The line is one wide block clipped to two identical heartbeats and
   translated by exactly one of them, so the loop is seamless; the clip is a stroked
   band rather than a single path, because a polygon that returns along itself has no
   area and would draw nothing at all. */
.wavelo--heartbeat{width:var(--wavelo-width,var(--wavelo-size,6.5rem));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem) * .75));overflow:hidden;background:linear-gradient(90deg,color-mix(in srgb,currentColor 8%,transparent) 1px,transparent 1px) 0 0/14px 100%,linear-gradient(0deg,color-mix(in srgb,currentColor 8%,transparent) 1px,transparent 1px) 0 0/100% 12px,color-mix(in srgb,currentColor 4%,transparent);border-radius:var(--wavelo-radius,4px)}
.wavelo--heartbeat:before{content:"";position:absolute;inset:0 -100%;background:currentColor;filter:drop-shadow(0 0 2px currentColor);clip-path:polygon(0% 58%,6% 58%,9% 48%,12% 58%,16% 66%,20% 12%,24% 88%,28% 58%,32% 42%,36% 58%,50% 58%,56% 58%,59% 48%,62% 58%,66% 66%,70% 12%,74% 88%,78% 58%,82% 42%,86% 58%,100% 58%,100% 64%,86% 64%,82% 48%,78% 64%,74% 94%,70% 18%,66% 72%,62% 64%,59% 54%,56% 64%,50% 64%,36% 64%,32% 48%,28% 64%,24% 94%,20% 18%,16% 72%,12% 64%,9% 54%,6% 64%,0% 64%);animation:wavelo-heart calc(var(--wavelo-duration,1s) * 2.4) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--heartbeat .wavelo__part{display:none}
/* A breath: one bar that widens and narrows on a slow cycle, which is the shape of a
   breathing guide rather than a spinner's. */
.wavelo--breathing{width:var(--wavelo-width,var(--wavelo-size,6rem));height:var(--wavelo-height,.5rem);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 15%,transparent);overflow:hidden}
.wavelo--breathing .wavelo__part{width:100%;height:100%;border-radius:inherit;transform-origin:50% 50%;animation:wavelo-breathe calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dot-wave{gap:var(--wavelo-gap,6px);align-items:center}
.wavelo--dot-wave .wavelo__part{width:calc(var(--wavelo-size,2.5rem) * .14);height:calc(var(--wavelo-size,2.5rem) * .14);border-radius:50%;flex:none;animation:wavelo-dot-wave var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dot-wave .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.16)}
.wavelo--dot-wave .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.32)}
.wavelo--dot-wave .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.48)}
.wavelo--dot-wave .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.64)}
${highlightFrames}${stripeFrames}${waveFrames}${dotWaveFrames}${waveformFrames}${waveformReverseFrames}${horizontalPulseFrames}${helixFrames}${helixRungFrames}${tokenFrames}${generateFrames}${heartFrames}${breatheFrames}`;
