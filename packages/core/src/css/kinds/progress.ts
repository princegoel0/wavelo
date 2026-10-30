import { css as uploadFrames } from '../keyframes/upload.js';
import { css as transitionFrames } from '../keyframes/transition.js';
import { css as waveRollFrames } from '../keyframes/wave-roll.js';

export const progressCss = `
.wavelo--progress{width:var(--wavelo-width,var(--wavelo-size,8rem));height:var(--wavelo-height,.5rem);overflow:hidden;border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 18%,transparent)}
.wavelo--progress .wavelo__part{height:100%;width:var(--wavelo-progress,35%);border-radius:inherit;transition:width .2s ease}
.wavelo--progress-ring{width:var(--wavelo-size,2.5rem);height:var(--wavelo-size,2.5rem);overflow:visible;border:0;border-radius:50%;background:conic-gradient(currentColor var(--wavelo-progress,35%),color-mix(in srgb,currentColor 18%,transparent) 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));animation:none}
.wavelo--progress-ring .wavelo__part{display:none}
.wavelo--progress-steps{width:var(--wavelo-width,var(--wavelo-size,8rem));gap:var(--wavelo-gap,3px);border-radius:var(--wavelo-radius,3px);background:transparent}
.wavelo--progress-steps .wavelo__part{flex:1 1 0;width:auto;height:100%;margin:0;border-radius:var(--wavelo-radius,2px);background:color-mix(in srgb,currentColor 18%,transparent);transition:none}
.wavelo--progress-steps .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
.wavelo--segmented-bar{border-radius:var(--wavelo-radius,3px)}
.wavelo--segmented-bar .wavelo__part{background:repeating-linear-gradient(90deg,currentColor 0 10px,transparent 10px 13px);border-radius:0}
.wavelo--progress-upload .wavelo__part{background:repeating-linear-gradient(45deg,currentColor 0 6px,color-mix(in srgb,currentColor 45%,transparent) 6px 12px);background-size:24px 100%;animation:wavelo-upload var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--page-transition{position:relative;top:0;left:0;width:100%;height:var(--wavelo-height,3px);border-radius:0;z-index:var(--wavelo-z-index,9999)}
.wavelo--page-transition .wavelo__part{background:linear-gradient(90deg,color-mix(in srgb,currentColor 35%,transparent),currentColor,color-mix(in srgb,currentColor 35%,transparent));background-size:200% 100%;animation:wavelo-transition var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--progress-top{position:fixed;top:0;left:0;width:100%;height:var(--wavelo-height,3px);border-radius:0;z-index:var(--wavelo-z-index,9999)}
/* A charge level: the shell is the element, the terminal is drawn outside it, and the
   fill is the value. The overflow stays visible so the terminal can sit past the edge. */
.wavelo--progress-battery{overflow:visible;width:var(--wavelo-width,var(--wavelo-size,4rem));height:var(--wavelo-height,1.75rem);padding:var(--wavelo-gap,2px);border:var(--wavelo-stroke,2px) solid currentColor;border-radius:var(--wavelo-radius,.35rem);background:color-mix(in srgb,currentColor 12%,transparent)}
.wavelo--progress-battery:after{content:"";position:absolute;top:32%;bottom:32%;left:100%;width:var(--wavelo-stroke,2px);border-radius:0 2px 2px 0;background:currentColor}
.wavelo--progress-battery .wavelo__part{border-radius:var(--wavelo-radius,2px)}
/* A gauge: a half turn of conic gradient, carved to a band by the same radial mask the
   ring spinner uses. The center is the bottom edge, so the arc runs 9 o'clock to 3. */
.wavelo--progress-half-ring{overflow:visible;width:var(--wavelo-width,var(--wavelo-size,5rem));height:var(--wavelo-height,calc(var(--wavelo-width,var(--wavelo-size,5rem)) / 2));border:0;border-radius:0;background:conic-gradient(from 270deg at 50% 100%,currentColor calc(var(--wavelo-progress,35%) / 2),color-mix(in srgb,currentColor 18%,transparent) 0);-webkit-mask:radial-gradient(circle farthest-side at 50% 100%,transparent calc(100% - var(--wavelo-stroke,6px)),#000 calc(100% - var(--wavelo-stroke,6px)));mask:radial-gradient(circle farthest-side at 50% 100%,transparent calc(100% - var(--wavelo-stroke,6px)),#000 calc(100% - var(--wavelo-stroke,6px)))}
.wavelo--progress-half-ring .wavelo__part{display:none}
/* A liquid level: the fill is the value's height, and its surface is a row of domes
   painted into the top of the fill itself, rolling sideways on the compositor. Painting
   the crest as the fill's own background rather than a floating layer is what makes an
   empty container look empty — with no water there is no surface. */
.wavelo--progress-wave-fill{align-items:flex-end;width:var(--wavelo-width,var(--wavelo-size,5rem));height:var(--wavelo-height,var(--wavelo-size,3rem));border-radius:var(--wavelo-radius,.5rem)}
.wavelo--progress-wave-fill .wavelo__part{width:100%;height:var(--wavelo-progress,35%);border-radius:0 0 var(--wavelo-radius,.5rem) var(--wavelo-radius,.5rem);background-color:color-mix(in srgb,currentColor 62%,transparent);background-image:radial-gradient(circle at 50% 0,currentColor 45%,transparent 46%);background-repeat:repeat-x;background-size:calc(var(--wavelo-width,var(--wavelo-size,5rem)) / 4) calc(var(--wavelo-stroke,3px) * 2);background-position:0 0;animation:wavelo-wave-roll var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);transition:height .2s ease}
/* The percentage counts itself up. The value arrives twice, once as a fraction for the
   bar and once as the registered integer below, because a counter needs a whole number
   and only a registered property can be interpolated. */
.wavelo--progress-count{overflow:visible;counter-reset:wavelo-count var(--wavelo-count,0);transition:--wavelo-progress .2s ease,--wavelo-count .6s ease}
.wavelo--progress-count:before{content:counter(wavelo-count) "%";position:absolute;left:0;bottom:calc(100% + 4px);font:inherit;font-variant-numeric:tabular-nums;color:currentColor}
/* Whole units, drawn as dots rather than bars. Which unit is filled is decided in the
   renderer, because CSS cannot compare a value against an index. */
.wavelo--progress-dots-fill{width:var(--wavelo-width,var(--wavelo-size,6rem));height:auto;gap:var(--wavelo-gap,6px);background:transparent;border-radius:0}
.wavelo--progress-dots-fill .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 3);height:calc(var(--wavelo-size,2.5rem) / 3);border-radius:50%;background:color-mix(in srgb,currentColor 22%,transparent);transition:none}
.wavelo--progress-dots-fill .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
/* The value description rides the edge of the fill. attr() reads the same string the
   element is given as aria-valuetext, so the label and the announcement cannot drift. */
.wavelo--progress-label-inline{overflow:visible}
.wavelo--progress-label-inline:after{content:attr(data-wavelo-value-text);position:absolute;left:var(--wavelo-progress,35%);bottom:calc(100% + 4px);padding:0 2px;font:inherit;font-variant-numeric:tabular-nums;color:currentColor;white-space:nowrap;transform:translateX(-50%)}
/* A ring whose filled arc is a gradient rather than a flat colour, masked to a band. */
.wavelo--progress-gradient-ring{overflow:visible;width:var(--wavelo-size,2.5rem);height:var(--wavelo-size,2.5rem);border:0;border-radius:50%;background:conic-gradient(from 0deg,var(--wavelo-secondary-color,#a5b4fc),currentColor var(--wavelo-progress,35%),color-mix(in srgb,currentColor 15%,transparent) var(--wavelo-progress,35%));-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)))}
.wavelo--progress-gradient-ring .wavelo__part{display:none}
/* Steps that number themselves. The counter increments per part, so the numbers are the
   renderer's part count rather than a string the caller keeps in step with it — and a
   bare number is what fits beneath a track this narrow. */
.wavelo--progress-multi-step{overflow:visible;width:var(--wavelo-width,var(--wavelo-size,10rem));height:auto;gap:var(--wavelo-gap,6px);background:transparent;border-radius:0}
.wavelo--progress-multi-step .wavelo__part{position:relative;flex:1 1 0;width:auto;height:var(--wavelo-stroke,3px);border-radius:var(--wavelo-radius,2px);background:color-mix(in srgb,currentColor 18%,transparent);counter-increment:wavelo-step;transition:none}
.wavelo--progress-multi-step .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
.wavelo--progress-multi-step .wavelo__part:after{content:counter(wavelo-step);position:absolute;top:calc(100% + 4px);left:50%;transform:translateX(-50%);font:inherit;color:currentColor}
/* A queue of files: one track per file, each filled by its own share of the same value,
   written by the renderer because the fractions are not whole units. */
.wavelo--progress-upload-multi{flex-direction:column;align-items:stretch;justify-content:center;width:var(--wavelo-width,var(--wavelo-size,10rem));height:auto;gap:var(--wavelo-gap,5px);background:transparent;border-radius:0}
.wavelo--progress-upload-multi .wavelo__part{position:relative;width:100%;height:var(--wavelo-stroke,3px);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 15%,transparent);transition:none}
.wavelo--progress-upload-multi .wavelo__part:after{content:"";position:absolute;inset:0 auto 0 0;width:var(--wavelo-progress,35%);border-radius:inherit;background:currentColor;transition:width .2s ease}
/* A skill level overshoots and settles, which is the reason it is a separate design
   from the bar. It also reads as one: the level is a gradient toward the accent colour,
   so the end of the fill is where the skill reaches its peak. */
.wavelo--progress-skill .wavelo__part{background:linear-gradient(90deg,currentColor,var(--wavelo-secondary-color,#a5b4fc));transition:width .6s cubic-bezier(.3,1.6,.5,1)}
/* Time remaining: the track empties as the value climbs, so the caller keeps reporting
   elapsed progress and the design reads it backwards. */
.wavelo--progress-timer .wavelo__part{width:calc(100% - var(--wavelo-progress,35%));background:color-mix(in srgb,currentColor 70%,transparent)}
/* Six stations around a ring, filled one by one as the value climbs. The positions are
   static, so unlike the orbit spinners this is a level rather than a motion. */
.wavelo--progress-orbit-fill{overflow:visible;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));background:transparent;border-radius:50%}
.wavelo--progress-orbit-fill .wavelo__part{position:absolute;left:50%;top:50%;width:16%;height:16%;margin:calc(var(--wavelo-size,2.5rem) * -.08);border-radius:50%;background:color-mix(in srgb,currentColor 22%,transparent);transition:none}
.wavelo--progress-orbit-fill .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
.wavelo--progress-orbit-fill .wavelo__part:nth-child(1){transform:rotate(0deg) translateY(calc(var(--wavelo-size,2.5rem) * -.38))}
.wavelo--progress-orbit-fill .wavelo__part:nth-child(2){transform:rotate(60deg) translateY(calc(var(--wavelo-size,2.5rem) * -.38))}
.wavelo--progress-orbit-fill .wavelo__part:nth-child(3){transform:rotate(120deg) translateY(calc(var(--wavelo-size,2.5rem) * -.38))}
.wavelo--progress-orbit-fill .wavelo__part:nth-child(4){transform:rotate(180deg) translateY(calc(var(--wavelo-size,2.5rem) * -.38))}
.wavelo--progress-orbit-fill .wavelo__part:nth-child(5){transform:rotate(240deg) translateY(calc(var(--wavelo-size,2.5rem) * -.38))}
.wavelo--progress-orbit-fill .wavelo__part:nth-child(6){transform:rotate(300deg) translateY(calc(var(--wavelo-size,2.5rem) * -.38))}
${uploadFrames}${transitionFrames}${waveRollFrames}`;
