import { css as uploadFrames } from '../keyframes/upload.js';
import { css as transitionFrames } from '../keyframes/transition.js';
import { css as waveRollFrames } from '../keyframes/wave-roll.js';
import { css as drainFrames } from '../keyframes/drain.js';
import { css as scanlineFrames } from '../keyframes/scanline.js';
import { css as brandFrames } from '../keyframes/brand-motion.js';

export const progressCss = `
.wavelo--progress{justify-content:flex-start;width:var(--wavelo-width,var(--wavelo-size,8rem));height:var(--wavelo-height,.5rem);overflow:hidden;border-radius:var(--wavelo-radius,999px);background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 18%,transparent))}
.wavelo--progress .wavelo__part{height:100%;width:var(--wavelo-progress,35%);border-radius:inherit;transition:width .2s ease}
.wavelo--progress-ring{width:var(--wavelo-size,2.5rem);height:var(--wavelo-size,2.5rem);overflow:visible;border:0;border-radius:50%;background:conic-gradient(currentColor var(--wavelo-progress,35%),var(--wavelo-secondary-color,color-mix(in srgb,currentColor 18%,transparent)) 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));animation:none}
.wavelo--progress-ring .wavelo__part{display:none}
.wavelo--progress-steps{width:var(--wavelo-width,var(--wavelo-size,8rem));gap:var(--wavelo-gap,3px);border-radius:var(--wavelo-radius,3px);background:transparent}
.wavelo--progress-steps .wavelo__part{flex:1 1 0;width:auto;height:100%;margin:0;border-radius:var(--wavelo-radius,2px);background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 18%,transparent));transition:none}
.wavelo--progress-steps .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
.wavelo--segmented-bar{border-radius:var(--wavelo-radius,3px)}
.wavelo--segmented-bar .wavelo__part{background:repeating-linear-gradient(90deg,currentColor 0 10px,transparent 10px 13px);border-radius:0}
.wavelo--progress-upload .wavelo__part{background:repeating-linear-gradient(45deg,currentColor 0 6px,color-mix(in srgb,currentColor 45%,transparent) 6px 12px);background-size:24px 100%;animation:wavelo-upload var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--page-transition{position:relative;top:0;left:0;width:100%;height:var(--wavelo-height,3px);border-radius:0;z-index:var(--wavelo-z-index,9999)}
.wavelo--page-transition .wavelo__part{background:linear-gradient(90deg,color-mix(in srgb,currentColor 35%,transparent),currentColor,color-mix(in srgb,currentColor 35%,transparent));background-size:200% 100%;animation:wavelo-transition var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--progress-top{position:fixed;top:0;left:0;width:100%;height:var(--wavelo-height,3px);border-radius:0;z-index:var(--wavelo-z-index,9999)}
/* A charge level: the shell is the element, the terminal is drawn outside it, and the
   fill is the value. The overflow stays visible so the terminal can sit past the edge. */
.wavelo--progress-battery{justify-content:flex-start;overflow:visible;width:var(--wavelo-width,var(--wavelo-size,4rem));height:var(--wavelo-height,1.75rem);padding:var(--wavelo-gap,2px);border:var(--wavelo-stroke,2px) solid currentColor;border-radius:var(--wavelo-radius,.35rem);background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 12%,transparent))}
.wavelo--progress-battery:after{content:"";position:absolute;top:32%;bottom:32%;left:100%;width:var(--wavelo-stroke,2px);border-radius:0 2px 2px 0;background:currentColor}
.wavelo--progress-battery .wavelo__part{border-radius:var(--wavelo-radius,2px)}
/* A gauge: a half turn of conic gradient, carved to a band by the same radial mask the
   ring spinner uses. The center is the bottom edge, so the arc runs 9 o'clock to 3. */
.wavelo--progress-half-ring{overflow:hidden;width:var(--wavelo-width,var(--wavelo-size,5rem));height:var(--wavelo-height,calc(var(--wavelo-width,var(--wavelo-size,5rem)) / 2));border:0;border-radius:9999px 9999px 0 0;background:conic-gradient(from 270deg at 50% 100%,currentColor calc(var(--wavelo-progress,35%) / 2),var(--wavelo-secondary-color,color-mix(in srgb,currentColor 18%,transparent)) 0);-webkit-mask:radial-gradient(circle farthest-side at 50% 100%,transparent calc(100% - var(--wavelo-stroke,7px)),#000 calc(100% - var(--wavelo-stroke,7px)));mask:radial-gradient(circle farthest-side at 50% 100%,transparent calc(100% - var(--wavelo-stroke,7px)),#000 calc(100% - var(--wavelo-stroke,7px)));filter:drop-shadow(0 -2px 8px color-mix(in srgb,currentColor 45%,transparent))}
.wavelo--progress-half-ring .wavelo__part{display:none}
/* A liquid level: the fill is the value's height, and its surface is a row of domes
   painted into the top of the fill itself, rolling sideways on the compositor. Painting
   the crest as the fill's own background rather than a floating layer is what makes an
   empty container look empty — with no water there is no surface. */
.wavelo--progress-wave-fill{position:relative;overflow:hidden;align-items:flex-end;width:var(--wavelo-width,var(--wavelo-size,3.25rem));height:var(--wavelo-height,var(--wavelo-size,3.25rem));border-radius:50%;background:radial-gradient(circle at 35% 25%,color-mix(in srgb,currentColor 10%,transparent) 0%,color-mix(in srgb,#000 45%,transparent) 100%),var(--wavelo-secondary-color,color-mix(in srgb,currentColor 16%,transparent));border:var(--wavelo-stroke,2.5px) solid color-mix(in srgb,currentColor 50%,#fff);box-shadow:inset 0 3px 6px rgba(255,255,255,.4),inset 0 -4px 10px rgba(0,0,0,.5),0 4px 16px color-mix(in srgb,currentColor 35%,transparent)}
.wavelo--progress-wave-fill:before{content:"";position:absolute;top:7%;left:12%;width:44%;height:24%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,255,255,.75) 0%,rgba(255,255,255,.15) 60%,transparent 100%);transform:rotate(-30deg);pointer-events:none;z-index:5}
.wavelo--progress-wave-fill:after{content:"";position:absolute;bottom:8%;right:14%;width:28%;height:12%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,255,255,.25) 0%,transparent 70%);pointer-events:none;z-index:5}
.wavelo--progress-wave-fill .wavelo__part{position:absolute;left:0;bottom:0;width:200%;height:var(--wavelo-progress,35%);background:linear-gradient(180deg,color-mix(in srgb,currentColor 85%,#fff) 0%,currentColor 40%,color-mix(in srgb,currentColor 70%,#000) 100%);transition:height .25s ease;animation:wavelo-wave-roll var(--wavelo-duration,1.4s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--progress-wave-fill .wavelo__part:before{content:"";position:absolute;left:0;bottom:calc(100% - 2px);width:200%;height:12px;background:color-mix(in srgb,currentColor 90%,#fff);-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 12' preserveAspectRatio='none'%3E%3Cpath fill='%23000' d='M0 6 Q 10 0 20 6 T 40 6 V 12 H 0 Z'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 12' preserveAspectRatio='none'%3E%3Cpath fill='%23000' d='M0 6 Q 10 0 20 6 T 40 6 V 12 H 0 Z'/%3E%3C/svg%3E");-webkit-mask-size:26px 12px;mask-size:26px 12px;-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;animation:wavelo-wave-roll var(--wavelo-duration,1.4s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--progress-wave-fill .wavelo__part:after{content:"";position:absolute;left:0;bottom:calc(100% - 4px);width:200%;height:14px;background:color-mix(in srgb,currentColor 55%,#fff);opacity:.65;-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 12' preserveAspectRatio='none'%3E%3Cpath fill='%23000' d='M0 6 Q 10 12 20 6 T 40 6 V 12 H 0 Z'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 12' preserveAspectRatio='none'%3E%3Cpath fill='%23000' d='M0 6 Q 10 12 20 6 T 40 6 V 12 H 0 Z'/%3E%3C/svg%3E");-webkit-mask-size:32px 14px;mask-size:32px 14px;-webkit-mask-repeat:repeat-x;mask-repeat:repeat-x;animation:wavelo-wave-roll var(--wavelo-duration,1.4s) linear infinite reverse var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,1.4s) * -.5)}
/* The percentage counts itself up. The value arrives twice, once as a fraction for the
   bar and once as the registered integer below, because a counter needs a whole number
   and only a registered property can be interpolated. */
.wavelo--progress-count{overflow:visible;counter-reset:wavelo-count var(--wavelo-count,0);transition:--wavelo-progress .2s ease,--wavelo-count .6s ease}
.wavelo--progress-count:before{content:counter(wavelo-count) "%";position:absolute;left:0;bottom:calc(100% + 4px);font:inherit;font-variant-numeric:tabular-nums;color:currentColor}
/* Whole units, drawn as dots rather than bars. Which unit is filled is decided in the
   renderer, because CSS cannot compare a value against an index. */
.wavelo--progress-dots-fill{width:var(--wavelo-width,var(--wavelo-size,6rem));height:auto;gap:var(--wavelo-gap,6px);background:transparent;border-radius:0}
.wavelo--progress-dots-fill .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 3);height:calc(var(--wavelo-size,2.5rem) / 3);border-radius:50%;background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 22%,transparent));transition:none}
.wavelo--progress-dots-fill .wavelo__part[data-wavelo-step="filled"]{background:currentColor}
/* The value description rides the edge of the fill. attr() reads the same string the
   element is given as aria-valuetext, so the label and the announcement cannot drift. */
.wavelo--progress-label-inline{overflow:visible}
.wavelo--progress-label-inline:after{content:attr(data-wavelo-value-text);position:absolute;left:var(--wavelo-progress,35%);bottom:calc(100% + 4px);padding:0 2px;font:inherit;font-variant-numeric:tabular-nums;color:currentColor;white-space:nowrap;transform:translateX(-50%)}
/* Steps that number themselves. The counter increments per part, so the numbers are the
   renderer's part count rather than a string the caller keeps in step with it — and a
   bare number is what fits beneath a track this narrow. */
.wavelo--progress-multi-step{overflow:visible;width:var(--wavelo-width,var(--wavelo-size,10rem));height:auto;gap:var(--wavelo-gap,6px);background:transparent;border-radius:0}
.wavelo--progress-multi-step .wavelo__part{position:relative;flex:1 1 0;width:auto;height:var(--wavelo-stroke,3px);border-radius:var(--wavelo-radius,2px);background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 18%,transparent));counter-increment:wavelo-step;transition:none}
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
.wavelo--undo-progress{width:var(--wavelo-width,var(--wavelo-size,10rem));height:var(--wavelo-height,.5rem);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 15%,transparent);position:relative;overflow:hidden;transition:background-color .25s ease,opacity .25s ease}
.wavelo--undo-progress .wavelo__part{height:100%;width:100%;border-radius:inherit;background:currentColor;transform-origin:left;animation:wavelo-drain var(--wavelo-duration,5s) linear forwards var(--wavelo-play-state,running);transition:background-color .25s ease,transform .25s ease}
.wavelo--undo-progress[data-wavelo-state="success"]{background:color-mix(in srgb,var(--wavelo-success-color,#22c55e) 20%,transparent)}
.wavelo--undo-progress[data-wavelo-state="success"] .wavelo__part{background:var(--wavelo-success-color,#22c55e);animation:none;transform:scaleX(1)}
.wavelo--undo-progress[data-wavelo-state="error"]{background:color-mix(in srgb,var(--wavelo-error-color,#ef4444) 20%,transparent);opacity:.5}
.wavelo--undo-progress[data-wavelo-state="error"] .wavelo__part{background:var(--wavelo-error-color,#ef4444);animation:none;transform:scaleX(0)}
.wavelo--undo-progress[data-wavelo-state="idle"]{opacity:.7}
.wavelo--undo-progress[data-wavelo-state="idle"] .wavelo__part{animation:none;transform:scaleX(1)}
.wavelo--crt-scanline{position:relative;width:var(--wavelo-width,var(--wavelo-size,10rem));height:var(--wavelo-height,1.25rem);border:1.5px solid currentColor;border-radius:3px;padding:2px;background:color-mix(in srgb,currentColor 8%,#050811);box-shadow:inset 0 0 8px color-mix(in srgb,currentColor 35%,transparent),0 0 8px color-mix(in srgb,currentColor 30%,transparent);overflow:hidden}
.wavelo--crt-scanline:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.25) 50%,transparent 100%);animation:wavelo-scanline var(--wavelo-duration,2s) linear infinite var(--wavelo-play-state,running);pointer-events:none;z-index:4}
.wavelo--crt-scanline .wavelo__part{height:100%;width:var(--wavelo-progress,35%);background:linear-gradient(90deg,currentColor,color-mix(in srgb,#fff 40%,currentColor));box-shadow:0 0 10px currentColor,0 0 18px color-mix(in srgb,currentColor 50%,transparent);border-radius:1px;transition:width .2s steps(10)}
.wavelo--crt-scanline:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 2px,rgba(0,0,0,.35) 2px 4px);pointer-events:none;z-index:5}
${uploadFrames}${transitionFrames}${waveRollFrames}${drainFrames}${scanlineFrames}
.wavelo--brand-loader{width:var(--wavelo-width,auto);height:var(--wavelo-height,auto);max-width:100%;background:var(--wavelo-background,transparent);border-radius:var(--wavelo-radius,0);overflow:visible;justify-content:center;font-size:var(--wavelo-size,2rem);line-height:1.3}
.wavelo__brand{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--brand-gap,.6em);max-width:100%;font-family:inherit;font-weight:700;line-height:inherit;text-align:center}
.wavelo__brand[data-layout="inline"]{flex-direction:row}
.wavelo__brand[data-layout="inline"]{flex-wrap:wrap}
.wavelo__brand[data-animation="none"] .wavelo__brand-char,.wavelo__brand[data-animation="pulse"] .wavelo__brand-char,.wavelo__brand[data-animation="shimmer"] .wavelo__brand-char{display:inline;white-space:pre-wrap;overflow-wrap:anywhere}
.wavelo__brand-caption{overflow-wrap:anywhere}
.wavelo__brand[data-align="start"]{align-items:flex-start;text-align:start}.wavelo__brand[data-align="end"]{align-items:flex-end;text-align:end}
.wavelo__brand-copy{min-width:0;max-width:100%;display:flex;flex-direction:column;gap:.3em}
.wavelo__brand-text{display:block;color:var(--brand-text,currentColor);white-space:pre-wrap;overflow-wrap:anywhere}
.wavelo__brand-char{display:inline-block;white-space:pre;animation-duration:var(--wavelo-duration,1.6s);animation-timing-function:var(--brand-ease,var(--wavelo-ease,ease-in-out));animation-iteration-count:infinite;animation-direction:var(--wavelo-direction,normal);animation-play-state:var(--wavelo-play-state,running);animation-delay:calc(var(--brand-delay,0s) + var(--letter,0)*var(--brand-stagger,.08s));animation-fill-mode:both}
.wavelo__brand[data-animation="wave"] .wavelo__brand-char{animation-name:wavelo-brand-wave}
.wavelo__brand[data-animation="bounce"] .wavelo__brand-char{animation-name:wavelo-brand-bounce}
.wavelo__brand[data-animation="flip"] .wavelo__brand-char{animation-name:wavelo-brand-flip}
.wavelo__brand[data-animation="typewriter"] .wavelo__brand-char{animation-name:wavelo-brand-typewriter}
.wavelo__brand[data-animation="pulse"] .wavelo__brand-text{animation:wavelo-brand-pulse var(--wavelo-duration,1.6s) var(--brand-ease,var(--wavelo-ease,ease-in-out)) var(--brand-delay,0s) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo__brand[data-animation="shimmer"] .wavelo__brand-text{color:var(--brand-text,currentColor);-webkit-text-fill-color:transparent;background:linear-gradient(90deg,var(--brand-text,currentColor) 20%,var(--wavelo-secondary-color,#38bdf8) 50%,var(--brand-text,currentColor) 80%);background-size:200% 100%;background-clip:text;-webkit-background-clip:text;animation:wavelo-brand-shimmer var(--wavelo-duration,1.6s) var(--brand-ease,var(--wavelo-ease,linear)) var(--brand-delay,0s) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo__brand-caption,.wavelo__brand-value{font-size:var(--brand-caption-size,.4em);font-weight:400;letter-spacing:normal;text-transform:none;color:var(--brand-caption,currentColor)}
.wavelo__brand-indicator{display:block;position:relative;flex:none;color:var(--wavelo-secondary-color,currentColor)}
.wavelo__brand-indicator i{display:none}
.wavelo__brand-indicator[data-indicator="ring"]{width:var(--brand-indicator-size,1.2em);height:var(--brand-indicator-size,1.2em);border:var(--wavelo-stroke,3px) solid var(--brand-track,color-mix(in srgb,currentColor 20%,transparent));border-top-color:currentColor;border-radius:50%;animation:wavelo-spin var(--wavelo-duration,1.6s) var(--brand-ease,var(--wavelo-ease,linear)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo__brand[data-progress="true"] .wavelo__brand-indicator[data-indicator="ring"]{border:0;animation:none;background:conic-gradient(currentColor var(--wavelo-progress,35%),var(--brand-track,color-mix(in srgb,currentColor 20%,transparent)) 0);mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 0)}
.wavelo__brand-indicator[data-indicator="bar"]{width:var(--brand-indicator-size,5em);max-width:100%;height:var(--wavelo-stroke,4px);overflow:hidden;border-radius:var(--brand-radius,999px);background:var(--brand-track,color-mix(in srgb,currentColor 20%,transparent))}
.wavelo__brand-indicator[data-indicator="bar"] i:first-child{display:block;height:100%;width:30%;background:currentColor;border-radius:inherit;animation:wavelo-brand-scan var(--wavelo-duration,1.6s) var(--brand-ease,var(--wavelo-ease,ease-in-out)) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo__brand[data-progress="true"] .wavelo__brand-indicator[data-indicator="bar"] i:first-child{width:100%;animation:none;transform:scaleX(calc(var(--brand-progress,0)));transform-origin:left;transition:transform .2s ease}
.wavelo__brand-indicator[data-indicator="dots"]{display:flex;align-items:center;gap:.25em;width:var(--brand-indicator-size,2em)}
.wavelo__brand-indicator[data-indicator="dots"] i{display:block;flex:1;aspect-ratio:1;border-radius:50%;background:currentColor;animation:wavelo-brand-pulse var(--wavelo-duration,1.6s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo__brand-indicator[data-indicator="dots"] i:nth-child(2){animation-delay:calc(var(--wavelo-duration,1.6s)/-3)}.wavelo__brand-indicator[data-indicator="dots"] i:nth-child(3){animation-delay:calc(var(--wavelo-duration,1.6s)*-2/3)}
.wavelo__brand[data-progress="true"] .wavelo__brand-indicator[data-indicator="dots"] i{animation:none;background:var(--brand-track,color-mix(in srgb,currentColor 20%,transparent))}
.wavelo__brand[data-progress="true"] .wavelo__brand-indicator[data-indicator="dots"] i:before{content:"";display:block;aspect-ratio:1;border-radius:50%;background:currentColor;transform:scale(clamp(0,calc(var(--brand-progress,0) * 3),1))}
.wavelo__brand[data-progress="true"] .wavelo__brand-indicator[data-indicator="dots"] i:nth-child(2):before{transform:scale(clamp(0,calc(var(--brand-progress,0) * 3 - 1),1))}.wavelo__brand[data-progress="true"] .wavelo__brand-indicator[data-indicator="dots"] i:nth-child(3):before{transform:scale(clamp(0,calc(var(--brand-progress,0) * 3 - 2),1))}
@media(prefers-reduced-motion:reduce){.wavelo:not([data-wavelo-motion="never"]) .wavelo__brand-char{opacity:1!important;transform:none!important}}.wavelo[data-wavelo-motion="always"] .wavelo__brand-char{opacity:1!important;transform:none!important}
@media(forced-colors:active){.wavelo__brand[data-animation="shimmer"] .wavelo__brand-text{background:none;color:CanvasText;-webkit-text-fill-color:CanvasText}.wavelo__brand-indicator{forced-color-adjust:none;color:CanvasText;--brand-track:GrayText}}
${brandFrames}
`;
