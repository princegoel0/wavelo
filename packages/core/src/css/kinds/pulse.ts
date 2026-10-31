import { css as scaleDotFrames } from '../keyframes/scale-dot.js';
import { css as thinkFrames } from '../keyframes/think.js';
import { css as thinkHaloFrames } from '../keyframes/think-halo.js';
import { css as blinkFrames } from '../keyframes/blink.js';
import { css as confirmFrames } from '../keyframes/confirm.js';
import { css as dragDropFrames } from '../keyframes/drag-drop.js';
import { css as pingFrames } from '../keyframes/ping.js';

export const pulseCss = `
.wavelo--pulse .wavelo__part{width:55%;height:55%;border-radius:50%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--button .wavelo__part{width:30%;height:30%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--inline .wavelo__part{width:18%;height:18%;animation:wavelo-bounce-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Three dots across a box cannot each be 55% of it: they overflowed and flex squeezed
   them sideways into 0.6-aspect ellipses while border-radius drew the round ends. Sized
   to fit the row, and told not to shrink. */
.wavelo--pulsing-dots .wavelo__part,.wavelo--background-operation .wavelo__part{flex:none;width:26%;height:26%}
.wavelo--pulsing-dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--pulsing-dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--expanding-dot .wavelo__part{width:70%;height:70%;animation:wavelo-scale-dot var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--grid-pulse{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:var(--wavelo-gap,calc(var(--wavelo-size,2.5rem) / 10));width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));background:transparent}
.wavelo--grid-pulse.wavelo-inline{display:inline-grid}
.wavelo--grid-pulse .wavelo__part{width:100%;height:100%;border-radius:18%;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--grid-pulse .wavelo__part:nth-child(2),.wavelo--grid-pulse .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) / -2)}
/* A model at work: one orb breathing, with a halo leaving it at half the cycle so
   the two read as a pulse rather than a spinner. */
.wavelo--thinking-glow .wavelo__part{width:44%;height:44%;animation:wavelo-think calc(var(--wavelo-duration,1s) * 1.8) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--thinking-glow:before{content:"";position:absolute;inset:8%;border:var(--wavelo-stroke,3px) solid currentColor;border-radius:50%;background:transparent;animation:wavelo-think-halo calc(var(--wavelo-duration,1s) * 1.8) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* The caret at the end of a streamed answer. It is a block, not a round dot, and it
   spends the first half of the cycle lit. */
.wavelo--stream-cursor .wavelo__part{width:42%;height:72%;border-radius:var(--wavelo-radius,2px);animation:wavelo-blink var(--wavelo-duration,1s) var(--wavelo-ease,steps(1,end)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--button-confirm{width:var(--wavelo-width,var(--wavelo-size,5.5rem));height:var(--wavelo-height,2rem);border-radius:999px;background:var(--wavelo-color,#6366f1);position:relative;display:inline-flex;align-items:center;justify-content:center}
.wavelo--button-confirm .wavelo__part{flex:none;width:6px;height:6px;border-radius:50%;margin:0 2px;background:#fff;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--button-confirm .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--button-confirm .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--button-confirm[data-wavelo-state="success"]{background:var(--wavelo-success-color,#22c55e);animation:wavelo-confirm calc(var(--wavelo-duration,1s) * .4) ease forwards}
.wavelo--button-confirm[data-wavelo-state="success"] .wavelo__part{display:none}
.wavelo--button-confirm[data-wavelo-state="success"]:after{content:"\\2713";color:#fff;font-size:1.1rem;font-weight:700;line-height:1}
.wavelo--button-confirm[data-wavelo-state="error"]{background:var(--wavelo-error-color,#ef4444);animation:none}
.wavelo--button-confirm[data-wavelo-state="error"] .wavelo__part{display:none}
.wavelo--button-confirm[data-wavelo-state="error"]:after{content:"\\00d7";color:#fff;font-size:1.3rem;font-weight:700;line-height:1}
.wavelo--button-confirm[data-wavelo-state="idle"]{opacity:.7}
.wavelo--toast-loading{display:inline-flex;align-items:center;gap:var(--wavelo-gap,8px);padding:4px 12px;width:var(--wavelo-width,var(--wavelo-size,9rem));height:var(--wavelo-height,2.2rem);border-radius:999px;background:color-mix(in srgb,currentColor 8%,transparent);border:1px solid color-mix(in srgb,currentColor 18%,transparent)}
.wavelo--toast-loading .wavelo__part:nth-child(1){flex:none;width:14px;height:14px;border-radius:50%;border:var(--wavelo-stroke,2px) solid currentColor;border-right-color:transparent;background:transparent;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--toast-loading .wavelo__part:nth-child(2){flex:1;height:8px;border-radius:var(--wavelo-radius,4px);animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--drag-drop-pulse{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:var(--wavelo-width,var(--wavelo-size,12rem));height:var(--wavelo-height,var(--wavelo-size,6rem));border:2px dashed color-mix(in srgb,currentColor 35%,transparent);border-radius:var(--wavelo-radius,8px);background:color-mix(in srgb,currentColor 4%,transparent);animation:wavelo-drag-drop calc(var(--wavelo-duration,1s) * 1.5) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--drag-drop-pulse .wavelo__part{width:28px;height:18px;border-radius:var(--wavelo-radius,4px);animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--offline-dot{width:var(--wavelo-width,var(--wavelo-size,2rem));height:var(--wavelo-height,var(--wavelo-size,2rem));position:relative;display:inline-flex;align-items:center;justify-content:center}
.wavelo--offline-dot .wavelo__part{width:12px;height:12px;border-radius:50%;background:currentColor;animation:wavelo-pulse var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--offline-dot:before{content:"";position:absolute;width:12px;height:12px;border-radius:50%;border:2px solid currentColor;animation:wavelo-ping calc(var(--wavelo-duration,1s) * 1.2) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--offline-dot[data-wavelo-state="success"] .wavelo__part{background:var(--wavelo-success-color,#22c55e);animation:none}
.wavelo--offline-dot[data-wavelo-state="success"]:before{display:none}
.wavelo--offline-dot[data-wavelo-state="error"] .wavelo__part{background:var(--wavelo-error-color,#ef4444);animation:none}
.wavelo--offline-dot[data-wavelo-state="error"]:before{border-color:var(--wavelo-error-color,#ef4444);animation:none;transform:scale(1.4);opacity:.4}
.wavelo--offline-dot[data-wavelo-state="idle"]{opacity:.5}
.wavelo--offline-dot[data-wavelo-state="idle"]:before{display:none}
${scaleDotFrames}${thinkFrames}${thinkHaloFrames}${blinkFrames}${confirmFrames}${dragDropFrames}${pingFrames}`;
