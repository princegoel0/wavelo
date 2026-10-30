import { css as highlightFrames } from '../keyframes/highlight.js';
import { css as stripeFrames } from '../keyframes/stripe.js';
import { css as waveFrames } from '../keyframes/wave.js';
import { css as waveformFrames } from '../keyframes/waveform.js';
import { css as waveformReverseFrames } from '../keyframes/waveform-reverse.js';
import { css as horizontalPulseFrames } from '../keyframes/horizontal-pulse.js';
import { css as helixFrames } from '../keyframes/helix.js';
import { css as helixLineFrames } from '../keyframes/helix-line.js';
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
.wavelo--vertical-dots{flex-direction:column}
.wavelo--vertical-dots .wavelo__part{animation:wavelo-bounce-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--waveform .wavelo__part{animation:wavelo-waveform var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--horizontal-pulse-bars .wavelo__part{animation:wavelo-horizontal-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--multi-wave .wavelo__part:nth-child(odd){animation:wavelo-waveform var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--multi-wave .wavelo__part:nth-child(even){animation:wavelo-waveform-reverse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--helix .wavelo__part{position:absolute;left:50%;width:12%;height:12%;margin-left:-6%;border-radius:50%;animation:wavelo-helix var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--helix{display:block;background:transparent}
/* Six dots spread down the box, each a sixth of a turn behind the last, so the swing
   reads as a strand turning. The spread is top, not a transform: a keyframe that animates
   transform replaces whatever static translate the dot carried, which is what had these
   six dots stacked at one point. */
.wavelo--helix .wavelo__part:nth-child(1){top:6%;animation-delay:calc(var(--wavelo-duration,1s) * -.83)}
.wavelo--helix .wavelo__part:nth-child(2){top:21%;animation-delay:calc(var(--wavelo-duration,1s) * -.67)}
.wavelo--helix .wavelo__part:nth-child(3){top:36%;animation-delay:calc(var(--wavelo-duration,1s) * -.5)}
.wavelo--helix .wavelo__part:nth-child(4){top:51%;animation-delay:calc(var(--wavelo-duration,1s) * -.33)}
.wavelo--helix .wavelo__part:nth-child(5){top:66%;animation-delay:calc(var(--wavelo-duration,1s) * -.17)}
.wavelo--helix .wavelo__part:nth-child(6){top:81%}
.wavelo--helix:before,.wavelo--helix:after{content:"";position:absolute;left:25%;top:46%;width:50%;height:8%;border-top:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;animation:wavelo-helix-line var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
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
.wavelo--heartbeat{width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem) * .5));overflow:hidden;background:transparent}
.wavelo--heartbeat:before{content:"";position:absolute;inset:0 -100%;background:currentColor;clip-path:polygon(0% 62%,12% 62%,18% 26%,24% 92%,30% 50%,44% 62%,50% 62%,62% 62%,68% 26%,74% 92%,80% 50%,94% 62%,100% 62%,100% 70%,94% 70%,80% 58%,74% 100%,68% 34%,62% 70%,50% 70%,44% 70%,30% 58%,24% 100%,18% 34%,12% 70%,0% 70%);animation:wavelo-heart var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--heartbeat .wavelo__part{display:none}
/* A breath: one bar that widens and narrows on a slow cycle, which is the shape of a
   breathing guide rather than a spinner's. */
.wavelo--breathing{width:var(--wavelo-width,var(--wavelo-size,6rem));height:var(--wavelo-height,.5rem);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 15%,transparent);overflow:hidden}
.wavelo--breathing .wavelo__part{width:100%;height:100%;border-radius:inherit;transform-origin:50% 50%;animation:wavelo-breathe calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${highlightFrames}${stripeFrames}${waveFrames}${waveformFrames}${waveformReverseFrames}${horizontalPulseFrames}${helixFrames}${helixLineFrames}${tokenFrames}${generateFrames}${heartFrames}${breatheFrames}`;
