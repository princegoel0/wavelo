import { css as equalizerFrames } from '../keyframes/equalizer.js';
import { css as fadeBarFrames } from '../keyframes/fade-bar.js';
import { css as growBarFrames } from '../keyframes/grow-bar.js';
import { css as pianoFrames } from '../keyframes/piano.js';
import { css as fireFrames } from '../keyframes/fire.js';
import { css as packetFlowFrames } from '../keyframes/packet-flow.js';
import { css as handoffFrames } from '../keyframes/handoff.js';
import { css as transcodeScanFrames } from '../keyframes/transcode-scan.js';

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
.wavelo--equalizer .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-equalizer var(--wavelo-duration,1s) var(--wavelo-ease,cubic-bezier(.45,0,.55,1)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--equalizer .wavelo__part:nth-child(even){background:var(--wavelo-secondary-color,currentColor)}
.wavelo--fading-bars .wavelo__part{animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--growing-bars .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,cubic-bezier(.34,1.56,.64,1)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(odd){height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,cubic-bezier(.34,1.56,.64,1)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(even){background:var(--wavelo-secondary-color,currentColor);animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Piano keys: the same fall-and-rise at four different points in the cycle, so the
   bars do not sweep as a wave but land one after another. */
.wavelo--piano-keys .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-piano calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,cubic-bezier(.34,1.56,.64,1)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
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




.wavelo--packet-pipeline{display:flex;flex-direction:column;justify-content:space-around;gap:calc(var(--wavelo-size,2.5rem)*.12);width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:calc(var(--wavelo-height,var(--wavelo-size,2.5rem))*.65);margin:auto;background:transparent;border:0}
.wavelo--packet-pipeline .wavelo__part{position:relative;width:100%;height:3px;background:color-mix(in srgb,currentColor 22%,transparent);border-radius:999px}
.wavelo--packet-pipeline .wavelo__part:before{content:"";position:absolute;left:-2px;top:-2px;width:7px;height:7px;border-radius:50%;background:color-mix(in srgb,currentColor 50%,transparent)}
.wavelo--packet-pipeline .wavelo__part:after{content:"";position:absolute;left:0;top:-1.5px;height:6px;width:38%;border-radius:999px;background:linear-gradient(90deg,transparent,currentColor,#fff);box-shadow:0 0 8px currentColor;animation:wavelo-packet-flow var(--wavelo-duration,1.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--packet-pipeline .wavelo__part:nth-child(2):after{animation-delay:calc(var(--wavelo-duration,1.4s)*-.35);background:linear-gradient(90deg,transparent,var(--wavelo-secondary-color,#38bdf8),#fff);box-shadow:0 0 8px var(--wavelo-secondary-color,#38bdf8)}
.wavelo--packet-pipeline .wavelo__part:nth-child(3):after{animation-delay:calc(var(--wavelo-duration,1.4s)*-.7)}
.wavelo--ai-tool-handoff{display:flex;align-items:center;justify-content:space-between;width:var(--wavelo-width,calc(var(--wavelo-size,2.5rem)*1.6));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem)*.5));margin:auto;border:0}
.wavelo--ai-tool-handoff .wavelo__part{border-radius:0;animation:none}
.wavelo--ai-tool-handoff .wavelo__part:nth-child(1){position:relative;width:calc(var(--wavelo-size,2.5rem)*.26);height:calc(var(--wavelo-size,2.5rem)*.26);min-width:10px;min-height:10px;border-radius:50%;border:var(--wavelo-stroke,2px) solid currentColor;flex-shrink:0;background:color-mix(in srgb,currentColor 15%,transparent);animation:wavelo-pulse var(--wavelo-duration,1.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--ai-tool-handoff .wavelo__part:nth-child(1):before{content:"";position:absolute;inset:22%;border-radius:50%;background:currentColor}
.wavelo--ai-tool-handoff .wavelo__part:nth-child(2){position:relative;flex:1;height:var(--wavelo-stroke,2px);margin:0 4px;border-radius:999px;background:color-mix(in srgb,currentColor 22%,transparent);overflow:visible}
.wavelo--ai-tool-handoff .wavelo__part:nth-child(2):after{content:"";position:absolute;left:0;top:calc(50% - 3px);width:26%;height:6px;border-radius:999px;background:linear-gradient(90deg,currentColor,var(--wavelo-secondary-color,#a855f7));box-shadow:0 0 6px currentColor;animation:wavelo-handoff-travel var(--wavelo-duration,1.4s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--ai-tool-handoff .wavelo__part:nth-child(3){position:relative;width:calc(var(--wavelo-size,2.5rem)*.24);height:calc(var(--wavelo-size,2.5rem)*.24);min-width:9px;min-height:9px;border-radius:2px;border:var(--wavelo-stroke,2px) solid var(--wavelo-secondary-color,#a855f7);transform:rotate(45deg);flex-shrink:0;background:color-mix(in srgb,var(--wavelo-secondary-color,#a855f7) 15%,transparent);animation:wavelo-pulse var(--wavelo-duration,1.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,1.4s)*-.7)}
.wavelo--ai-tool-handoff .wavelo__part:nth-child(3):before{content:"";position:absolute;inset:20%;border-radius:1px;background:var(--wavelo-secondary-color,#a855f7)}
.wavelo--ai-tool-handoff:not([data-wavelo-state="loading"]) .wavelo__part{animation:none}
.wavelo--ai-tool-handoff[data-wavelo-state="approval"] .wavelo__part:nth-child(2){background:color-mix(in srgb,var(--wavelo-secondary-color,#f59e0b) 35%,transparent)}
.wavelo--ai-tool-handoff[data-wavelo-state="approval"] .wavelo__part:nth-child(2):after{left:50%;transform:translateX(-50%);animation:none;width:14px;height:14px;top:calc(50% - 7px);border-radius:3px;background:var(--wavelo-secondary-color,#f59e0b);box-shadow:0 0 6px var(--wavelo-secondary-color,#f59e0b)}
.wavelo--ai-tool-handoff[data-wavelo-state="approval"] .wavelo__part:nth-child(2):before{content:"";position:absolute;left:50%;top:calc(50% - 4px);width:6px;height:8px;transform:translateX(-50%);border-left:2px solid #000;border-right:2px solid #000;z-index:2}
.wavelo--ai-tool-handoff[data-wavelo-state="success"] .wavelo__part:nth-child(2){background:color-mix(in srgb,var(--wavelo-success-color,#22c55e) 40%,transparent)}
.wavelo--ai-tool-handoff[data-wavelo-state="success"] .wavelo__part:nth-child(2):after{left:calc(100% - 10px);transform:none;animation:none;width:10px;height:10px;top:calc(50% - 5px);border-radius:50%;background:var(--wavelo-success-color,#22c55e);box-shadow:0 0 8px var(--wavelo-success-color,#22c55e)}
.wavelo--ai-tool-handoff[data-wavelo-state="success"] .wavelo__part:nth-child(3){border-color:var(--wavelo-success-color,#22c55e)}
.wavelo--ai-tool-handoff[data-wavelo-state="success"] .wavelo__part:nth-child(3):before{background:var(--wavelo-success-color,#22c55e)}
.wavelo--ai-tool-handoff:is([data-wavelo-state="error"],[data-wavelo-state="denied"]) .wavelo__part:nth-child(2){background:repeating-linear-gradient(90deg,var(--wavelo-error-color,#ef4444) 0 4px,transparent 4px 8px)}
.wavelo--ai-tool-handoff:is([data-wavelo-state="error"],[data-wavelo-state="denied"]) .wavelo__part:nth-child(2):after{left:50%;transform:translateX(-50%);animation:none;width:12px;height:12px;top:calc(50% - 6px);border-radius:50%;background:var(--wavelo-error-color,#ef4444);box-shadow:0 0 6px var(--wavelo-error-color,#ef4444)}
.wavelo--ai-tool-handoff:is([data-wavelo-state="error"],[data-wavelo-state="denied"]) .wavelo__part:nth-child(2):before{content:"\\00d7";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#fff;font-size:11px;font-weight:700;line-height:1;z-index:2}
.wavelo--ai-tool-handoff:is([data-wavelo-state="error"],[data-wavelo-state="denied"]) .wavelo__part:nth-child(3){border-color:var(--wavelo-error-color,#ef4444)}
.wavelo--ai-tool-handoff:is([data-wavelo-state="error"],[data-wavelo-state="denied"]) .wavelo__part:nth-child(3):before{background:var(--wavelo-error-color,#ef4444)}
.wavelo--media-transcode{display:flex;align-items:center;justify-content:space-between;width:var(--wavelo-width,calc(var(--wavelo-size,2.5rem)*1.8));height:var(--wavelo-height,calc(var(--wavelo-size,2.5rem)*.7));margin:auto;border:0}
.wavelo--media-transcode .wavelo__part{border-radius:0;animation:none}
.wavelo--media-transcode .wavelo__part:nth-child(1){position:relative;width:30%;height:80%;border:var(--wavelo-stroke,2px) solid currentColor;border-radius:3px;background:color-mix(in srgb,currentColor 10%,transparent);flex-shrink:0;overflow:hidden;animation:wavelo-pulse var(--wavelo-duration,1.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--media-transcode .wavelo__part:nth-child(1):before{content:"";position:absolute;inset:2px 2px auto 2px;height:3px;background:repeating-linear-gradient(90deg,currentColor 0 3px,transparent 3px 6px)}
.wavelo--media-transcode .wavelo__part:nth-child(1):after{content:"";position:absolute;inset:auto 2px 2px 2px;height:3px;background:repeating-linear-gradient(90deg,currentColor 0 3px,transparent 3px 6px)}
.wavelo--media-transcode .wavelo__part:nth-child(2){position:relative;width:24%;height:92%;border:var(--wavelo-stroke,2px) solid var(--wavelo-secondary-color,#38bdf8);border-radius:4px;background:color-mix(in srgb,var(--wavelo-secondary-color,#38bdf8) 12%,transparent);flex-shrink:0;overflow:hidden}
.wavelo--media-transcode .wavelo__part:nth-child(2):before{content:"";position:absolute;left:0;right:0;height:3px;top:0;background:linear-gradient(90deg,transparent,#fff,transparent);box-shadow:0 0 6px var(--wavelo-secondary-color,#38bdf8);animation:wavelo-transcode-scan var(--wavelo-duration,1.4s) ease-in-out infinite alternate var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--media-transcode .wavelo__part:nth-child(3){position:relative;width:30%;height:80%;border:var(--wavelo-stroke,2px) dashed color-mix(in srgb,currentColor 40%,transparent);border-radius:4px;background:color-mix(in srgb,currentColor 6%,transparent);flex-shrink:0;display:flex;align-items:center;justify-content:center}
.wavelo--media-transcode .wavelo__part:nth-child(3):before{content:"";width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:7px solid color-mix(in srgb,currentColor 50%,transparent);margin-left:2px;animation:wavelo-pulse var(--wavelo-duration,1.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,1.4s)*-.7)}
.wavelo--media-transcode:not([data-wavelo-state="loading"]) .wavelo__part{animation:none}
.wavelo--media-transcode:not([data-wavelo-state="loading"]) .wavelo__part:before{animation:none}
.wavelo--media-transcode:is([data-wavelo-state="ready"],[data-wavelo-state="success"]) .wavelo__part:nth-child(2){border-color:var(--wavelo-success-color,#22c55e);background:color-mix(in srgb,var(--wavelo-success-color,#22c55e) 15%,transparent)}
.wavelo--media-transcode:is([data-wavelo-state="ready"],[data-wavelo-state="success"]) .wavelo__part:nth-child(2):before{display:none}
.wavelo--media-transcode:is([data-wavelo-state="ready"],[data-wavelo-state="success"]) .wavelo__part:nth-child(3){border-style:solid;border-color:var(--wavelo-success-color,#22c55e);background:color-mix(in srgb,var(--wavelo-success-color,#22c55e) 15%,transparent)}
.wavelo--media-transcode:is([data-wavelo-state="ready"],[data-wavelo-state="success"]) .wavelo__part:nth-child(3):before{border-left-color:var(--wavelo-success-color,#22c55e)}
.wavelo--media-transcode:is([data-wavelo-state="error"],[data-wavelo-state="failed"]) .wavelo__part:nth-child(2){border-color:var(--wavelo-error-color,#ef4444);background:color-mix(in srgb,var(--wavelo-error-color,#ef4444) 15%,transparent)}
.wavelo--media-transcode:is([data-wavelo-state="error"],[data-wavelo-state="failed"]) .wavelo__part:nth-child(2):before{content:"\\00d7";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--wavelo-error-color,#ef4444);font-size:12px;font-weight:700;line-height:1;background:none;box-shadow:none}
.wavelo--media-transcode:is([data-wavelo-state="error"],[data-wavelo-state="failed"]) .wavelo__part:nth-child(3){border-color:var(--wavelo-error-color,#ef4444)}
${equalizerFrames}${fadeBarFrames}${growBarFrames}${pianoFrames}${fireFrames}${packetFlowFrames}${handoffFrames}${transcodeScanFrames}`;
