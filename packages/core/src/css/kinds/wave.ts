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
import { css as oscillateFrames } from '../keyframes/oscillate.js';

export const waveCss = `
.wavelo--wave{gap:var(--wavelo-gap,3px)}
.wavelo--wave .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 8);height:70%;border-radius:var(--wavelo-radius,2px);animation:wavelo-wave var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--moving-stripe{width:var(--wavelo-width,var(--wavelo-size,6.5rem));height:var(--wavelo-height,.875rem);border-radius:var(--wavelo-radius,9999px);overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,.2);background-color:color-mix(in srgb,currentColor 18%,transparent);background-image:linear-gradient(135deg,currentColor 25%,transparent 25%,transparent 50%,currentColor 50%,currentColor 75%,transparent 75%,transparent);background-size:24px 24px;animation:wavelo-stripe var(--wavelo-duration,1.2s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--moving-stripe .wavelo__part{display:none}
.wavelo--traveling-highlight{width:var(--wavelo-width,var(--wavelo-size,6.5rem));height:var(--wavelo-height,.875rem);border-radius:var(--wavelo-radius,9999px);position:relative;overflow:hidden;background:color-mix(in srgb,currentColor 22%,transparent);border:1px solid color-mix(in srgb,currentColor 20%,transparent);box-shadow:inset 0 1px 2px rgba(0,0,0,.2)}
.wavelo--traveling-highlight .wavelo__part{display:none}
.wavelo--traveling-highlight:after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(90deg,transparent 0%,color-mix(in srgb,var(--wavelo-secondary-color,currentColor) 40%,transparent) 20%,#fff 50%,color-mix(in srgb,var(--wavelo-secondary-color,currentColor) 40%,transparent) 80%,transparent 100%);filter:drop-shadow(0 0 6px currentColor);transform:translateX(-100%);animation:wavelo-highlight var(--wavelo-duration,1.3s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--oscillating-line{width:var(--wavelo-width,var(--wavelo-size,5.5rem));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem) * .75));position:relative;overflow:hidden;background:color-mix(in srgb,currentColor 6%,transparent);border-radius:var(--wavelo-radius,6px);border:var(--wavelo-stroke,1px) solid color-mix(in srgb,currentColor 15%,transparent)}
.wavelo--oscillating-line .wavelo__part{display:none}
.wavelo--oscillating-line:before{content:"";position:absolute;top:0;bottom:0;left:0;width:200%;background:currentColor;filter:drop-shadow(0 0 2px currentColor);clip-path:polygon(0.0% 45.5%,1.6% 54.7%,3.1% 63.6%,4.7% 71.3%,6.2% 76.7%,7.8% 79.0%,9.4% 77.8%,10.9% 73.1%,12.5% 65.5%,14.1% 55.7%,15.6% 45.0%,17.2% 34.9%,18.8% 26.6%,20.3% 21.0%,21.9% 19.0%,23.4% 20.9%,25.0% 26.3%,26.6% 34.5%,28.1% 44.5%,29.7% 55.2%,31.2% 65.0%,32.8% 72.8%,34.4% 77.6%,35.9% 79.0%,37.5% 76.9%,39.1% 71.7%,40.6% 64.0%,42.2% 54.9%,43.8% 45.5%,45.3% 36.4%,46.9% 27.8%,48.4% 21.6%,50.0% 19.0%,51.6% 20.3%,53.1% 25.1%,54.7% 32.8%,56.2% 42.6%,57.8% 53.4%,59.4% 63.4%,60.9% 71.7%,62.5% 77.0%,64.1% 79.0%,65.6% 77.4%,67.2% 72.3%,68.8% 64.6%,70.3% 54.7%,71.9% 45.1%,73.4% 35.5%,75.0% 27.0%,76.6% 21.2%,78.1% 19.0%,79.7% 20.6%,81.2% 25.7%,82.8% 33.7%,84.4% 43.6%,85.9% 54.4%,87.5% 64.4%,89.1% 72.4%,90.6% 77.4%,92.2% 79.0%,93.8% 77.1%,95.3% 72.0%,96.9% 64.3%,98.4% 54.8%,100.0% 45.5%,100.0% 54.5%,98.4% 63.8%,96.9% 73.3%,95.3% 81.0%,93.8% 86.1%,92.2% 88.0%,90.6% 86.4%,89.1% 81.4%,87.5% 73.4%,85.9% 63.4%,84.4% 52.6%,82.8% 42.7%,81.2% 34.7%,79.7% 29.6%,78.1% 28.0%,76.6% 30.2%,75.0% 36.0%,73.4% 44.5%,71.9% 54.1%,70.3% 63.7%,68.8% 73.6%,67.2% 81.3%,65.6% 86.4%,64.1% 88.0%,62.5% 86.0%,60.9% 80.7%,59.4% 72.4%,57.8% 62.4%,56.2% 51.6%,54.7% 41.8%,53.1% 34.1%,51.6% 29.3%,50.0% 28.0%,48.4% 30.6%,46.9% 36.8%,45.3% 45.4%,43.8% 54.5%,42.2% 63.9%,40.6% 73.0%,39.1% 80.7%,37.5% 85.9%,35.9% 88.0%,34.4% 86.6%,32.8% 81.8%,31.2% 74.0%,29.7% 64.2%,28.1% 53.5%,26.6% 43.5%,25.0% 35.3%,23.4% 29.9%,21.9% 28.0%,20.3% 30.0%,18.8% 35.6%,17.2% 43.9%,15.6% 54.0%,14.1% 64.7%,12.5% 74.5%,10.9% 82.1%,9.4% 86.8%,7.8% 88.0%,6.2% 85.7%,4.7% 80.3%,3.1% 72.6%,1.6% 63.7%,0.0% 54.5%);animation:wavelo-oscillate var(--wavelo-duration,1.2s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--oscillating-line:after{content:"";position:absolute;left:0;right:0;top:50%;height:var(--wavelo-stroke,1px);margin-top:calc(var(--wavelo-stroke,1px) * -.5);background:color-mix(in srgb,currentColor 18%,transparent)}
.wavelo--horizontal-pulse-bars .wavelo__part{animation:wavelo-horizontal-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--multi-wave .wavelo__part:nth-child(odd){animation:wavelo-waveform var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--multi-wave .wavelo__part:nth-child(even){animation:wavelo-waveform-reverse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Authentic 3D double helix: 18 rotating base-pair rungs with complementary nodes.
   Perspective is applied to the container, and each part is a base-pair rung that rotates
   around the Y-axis. The pseudo-elements :before and :after form the twin DNA strands. */
.wavelo--helix{display:block;background:transparent;width:var(--wavelo-width,calc(var(--wavelo-size,2.5rem) * 1.1));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem) * 2.2));perspective:400px}
.wavelo--helix .wavelo__part{position:absolute;left:10%;width:80%;height:var(--wavelo-stroke,2px);border-radius:var(--wavelo-stroke,2px);background:linear-gradient(90deg,currentColor,var(--wavelo-secondary-color,color-mix(in srgb,currentColor 35%,#ec4899)));transform-style:preserve-3d;animation:wavelo-helix var(--wavelo-duration,1.8s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running),wavelo-helix-rung var(--wavelo-duration,1.8s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);top:calc(3% + var(--i,0) * 5.3%);animation-delay:calc(var(--wavelo-duration,1.8s) * var(--i,0) * -0.07)}
.wavelo--helix .wavelo__part:before{content:"";position:absolute;left:-4px;top:calc(50% - 4px);width:8px;height:8px;border-radius:50%;background:currentColor;box-shadow:0 0 5px currentColor}
.wavelo--helix .wavelo__part:after{content:"";position:absolute;right:-4px;top:calc(50% - 4px);width:8px;height:8px;border-radius:50%;background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 35%,#ec4899));box-shadow:0 0 5px var(--wavelo-secondary-color,color-mix(in srgb,currentColor 35%,#ec4899))}
.wavelo--helix .wavelo__part:nth-child(1){--i:0}
.wavelo--helix .wavelo__part:nth-child(2){--i:1}
.wavelo--helix .wavelo__part:nth-child(3){--i:2}
.wavelo--helix .wavelo__part:nth-child(4){--i:3}
.wavelo--helix .wavelo__part:nth-child(5){--i:4}
.wavelo--helix .wavelo__part:nth-child(6){--i:5}
.wavelo--helix .wavelo__part:nth-child(7){--i:6}
.wavelo--helix .wavelo__part:nth-child(8){--i:7}
.wavelo--helix .wavelo__part:nth-child(9){--i:8}
.wavelo--helix .wavelo__part:nth-child(10){--i:9}
.wavelo--helix .wavelo__part:nth-child(11){--i:10}
.wavelo--helix .wavelo__part:nth-child(12){--i:11}
.wavelo--helix .wavelo__part:nth-child(13){--i:12}
.wavelo--helix .wavelo__part:nth-child(14){--i:13}
.wavelo--helix .wavelo__part:nth-child(15){--i:14}
.wavelo--helix .wavelo__part:nth-child(16){--i:15}
.wavelo--helix .wavelo__part:nth-child(17){--i:16}
.wavelo--helix .wavelo__part:nth-child(18){--i:17}
.wavelo--token-stream{gap:var(--wavelo-gap,3px);justify-content:flex-start}
.wavelo--token-stream .wavelo__part{width:18%;height:calc(var(--wavelo-stroke,3px) * 1.5);border-radius:var(--wavelo-radius,1px);animation:wavelo-token calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--token-stream .wavelo__part:nth-child(even){background:var(--wavelo-secondary-color,currentColor)}
.wavelo--token-stream .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.32)}
.wavelo--token-stream .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.64)}
.wavelo--token-stream .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.96)}
.wavelo--token-stream .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -1.28)}
.wavelo--progress-ai-generate{width:var(--wavelo-width,var(--wavelo-size,8rem));height:var(--wavelo-height,.5rem);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 15%,transparent);overflow:hidden}
.wavelo--progress-ai-generate .wavelo__part{width:45%;height:100%;border-radius:inherit;background:linear-gradient(90deg,transparent,var(--wavelo-secondary-color,#a5b4fc),currentColor,var(--wavelo-secondary-color,#a5b4fc),transparent);animation:wavelo-generate calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--heartbeat{width:var(--wavelo-width,var(--wavelo-size,6.5rem));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem) * .75));overflow:hidden;background:linear-gradient(90deg,var(--wavelo-secondary-color,color-mix(in srgb,currentColor 8%,transparent)) 1px,transparent 1px) 0 0/14px 100%,linear-gradient(0deg,var(--wavelo-secondary-color,color-mix(in srgb,currentColor 8%,transparent)) 1px,transparent 1px) 0 0/100% 12px,var(--wavelo-background,color-mix(in srgb,currentColor 4%,transparent));border-radius:var(--wavelo-radius,4px)}
.wavelo--heartbeat:before{content:"";position:absolute;inset:0 -100%;background:currentColor;filter:drop-shadow(0 0 2px currentColor);clip-path:polygon(0% 58%,6% 58%,9% 48%,12% 58%,16% 66%,20% 12%,24% 88%,28% 58%,32% 42%,36% 58%,50% 58%,56% 58%,59% 48%,62% 58%,66% 66%,70% 12%,74% 88%,78% 58%,82% 42%,86% 58%,100% 58%,100% 64%,86% 64%,82% 48%,78% 64%,74% 94%,70% 18%,66% 72%,62% 64%,59% 54%,56% 64%,50% 64%,36% 64%,32% 48%,28% 64%,24% 94%,20% 18%,16% 72%,12% 64%,9% 54%,6% 64%,0% 64%);animation:wavelo-heart calc(var(--wavelo-duration,1s) * 2.4) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--heartbeat .wavelo__part{display:none}
.wavelo--breathing{width:var(--wavelo-width,var(--wavelo-size,6rem));height:var(--wavelo-height,.5rem);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 15%,transparent);overflow:hidden}
.wavelo--breathing .wavelo__part{width:100%;height:100%;border-radius:inherit;transform-origin:50% 50%;animation:wavelo-breathe calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dot-wave{gap:var(--wavelo-gap,6px);align-items:center}
.wavelo--dot-wave .wavelo__part{width:calc(var(--wavelo-size,2.5rem) * .14);height:calc(var(--wavelo-size,2.5rem) * .14);border-radius:50%;flex:none;animation:wavelo-dot-wave var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--dot-wave .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.16)}
.wavelo--dot-wave .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.32)}
.wavelo--dot-wave .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.48)}
.wavelo--dot-wave .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.64)}
${highlightFrames}${stripeFrames}${waveFrames}${dotWaveFrames}${waveformFrames}${waveformReverseFrames}${horizontalPulseFrames}${helixFrames}${helixRungFrames}${tokenFrames}${generateFrames}${heartFrames}${breatheFrames}${oscillateFrames}`;
