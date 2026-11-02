import { css as orbitFrames } from '../keyframes/orbit.js';
import { css as cometTailFrames } from '../keyframes/comet-tail.js';
import { css as fireflyFrames } from '../keyframes/firefly.js';
import { css as orbitRingFrames } from '../keyframes/orbit-ring.js';
import { css as atomFrames } from '../keyframes/atom-orbit.js';
import { css as blackHoleFrames } from '../keyframes/black-hole.js';
import { css as magneticFrames } from '../keyframes/magnetic.js';

export const orbitCss = `
.wavelo--orbit{display:block;background:transparent}
.wavelo--orbit.wavelo-inline{display:inline-block}
.wavelo--orbit .wavelo__part{position:absolute;left:50%;top:50%;width:18%;height:18%;border-radius:50%;transform-origin:0 0;animation:wavelo-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--orbit .wavelo__part:nth-child(1){--orbit-angle:0deg}
.wavelo--orbit .wavelo__part:nth-child(2){--orbit-angle:72deg}
.wavelo--orbit .wavelo__part:nth-child(3){--orbit-angle:144deg}
.wavelo--orbit .wavelo__part:nth-child(4){--orbit-angle:216deg}
.wavelo--orbit .wavelo__part:nth-child(5){--orbit-angle:288deg}
.wavelo--orbiting-dots:before{content:"";position:absolute;left:50%;top:50%;width:12%;height:12%;margin:-6% 0 0 -6%;border-radius:50%;background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 35%,transparent))}
.wavelo--particle-orbit .wavelo__part{width:10%;height:10%;box-shadow:0 0 0 2px color-mix(in srgb,currentColor 30%,transparent)}
.wavelo--rotating-dots .wavelo__part{animation:wavelo-dot-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* The ring is one radius wide and the dots ride it a fifth of a turn apart; without the
   stagger every dot is at the same point of the same circle, which renders as one blob. */
.wavelo--rotating-dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.2)}
.wavelo--rotating-dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.4)}
.wavelo--rotating-dots .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.6)}
.wavelo--rotating-dots .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.8)}
/* One head on a mask-carved conic sweep: the arc fades out behind it and both turn
   together, so the tail always trails the dot. The mask lives on the tail layer, so
   the head is not carved along with it, and the prefixed copy is there because the
   unprefixed mask shorthand is newer than the declared browser floor. */
/* The tail and the dot used to spin about different centres — the pseudo about its own
   middle, the dot about a point 90% to its left — so the head slid away from the tail and
   the design showed a crescent with an unrelated dot drifting past it. The spin now lives
   on the root and both are placed inside it, so they turn as one object by construction.
   The dot sits on the ring's mid-line at twelve o'clock, which is where the conic reaches
   full strength, and the fade is a long ramp rather than two hard stops. */
.wavelo--comet-orbit{display:block;background:transparent;animation:wavelo-spin var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--comet-orbit.wavelo-inline{display:inline-block}
.wavelo--comet-orbit:before{content:"";position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 26%,color-mix(in srgb,currentColor 8%,transparent) 48%,color-mix(in srgb,currentColor 42%,transparent) 76%,currentColor 99%,transparent);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));mask:radial-gradient(farthest-side,transparent calc(100% - var(--wavelo-stroke,3px)),#000 calc(100% - var(--wavelo-stroke,3px)));animation:wavelo-comet-tail calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--comet-orbit .wavelo__part{left:50%;top:calc(var(--wavelo-stroke,3px) / 2 - var(--wavelo-size,2.5rem) * .09);margin-left:calc(var(--wavelo-size,2.5rem) * -.09);width:18%;height:18%;animation:none}
/* Ten motes drifting on uneven paths and glowing as they go, with natural firefly bioluminescence. */
.wavelo--fireflies .wavelo__part{width:8%;height:8%;border-radius:50%;box-shadow:0 0 5px currentColor,0 0 8px color-mix(in srgb,currentColor 50%,transparent);animation:wavelo-firefly calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fireflies .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.3)}
.wavelo--fireflies .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.6)}
.wavelo--fireflies .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.9)}
.wavelo--fireflies .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--fireflies .wavelo__part:nth-child(6){animation-delay:calc(var(--wavelo-duration,1s) * -1.5)}
.wavelo--fireflies .wavelo__part:nth-child(7){animation-delay:calc(var(--wavelo-duration,1s) * -1.8)}
.wavelo--fireflies .wavelo__part:nth-child(8){animation-delay:calc(var(--wavelo-duration,1s) * -2.1)}
.wavelo--fireflies .wavelo__part:nth-child(9){animation-delay:calc(var(--wavelo-duration,1s) * -2.4)}
.wavelo--fireflies .wavelo__part:nth-child(10){animation-delay:calc(var(--wavelo-duration,1s) * -2.7)}
/* The Solar System: central radiant Sun, concentric orbital rings, and planets orbiting in Keplerian resonance. */
.wavelo--solar-system{position:relative;width:var(--wavelo-width,var(--wavelo-size,3rem));height:var(--wavelo-height,var(--wavelo-size,3rem));margin:auto;border-radius:50%;background:radial-gradient(ellipse 32% 17.6% at 50% 50%,transparent calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) 100%,transparent 100%),radial-gradient(ellipse 50% 27.6% at 50% 50%,transparent calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) 100%,transparent 100%),radial-gradient(ellipse 68% 37.4% at 50% 50%,transparent calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) 100%,transparent 100%),radial-gradient(ellipse 88% 48.4% at 50% 50%,transparent calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) calc(100% - 1.2px),color-mix(in srgb,currentColor 22%,transparent) 100%,transparent 100%)}
.wavelo--solar-system:before{content:"";position:absolute;left:50%;top:50%;width:22%;height:22%;margin:-11% 0 0 -11%;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff 0%,#fde047 30%,var(--wavelo-secondary-color,#f59e0b) 70%,#d97706 100%);box-shadow:0 0 10px var(--wavelo-secondary-color,#f59e0b),0 0 20px rgba(245,158,11,.5),0 0 2px #fff}
.wavelo--solar-system .wavelo__part{position:absolute;left:50%;top:50%;border-radius:50%;animation:wavelo-orbit-ring var(--wavelo-duration,2s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--solar-system .wavelo__part:nth-child(1){width:4.5px;height:4.5px;margin:-2.25px 0 0 -2.25px;--rx:calc(var(--wavelo-size,3rem) * .16);--ry:calc(var(--wavelo-size,3rem) * .088);animation-duration:calc(var(--wavelo-duration,2s) * .5);background:#cbd5e1;box-shadow:0 0 3px #cbd5e1}
.wavelo--solar-system .wavelo__part:nth-child(2){width:6.5px;height:6.5px;margin:-3.25px 0 0 -3.25px;--rx:calc(var(--wavelo-size,3rem) * .25);--ry:calc(var(--wavelo-size,3rem) * .138);animation-duration:calc(var(--wavelo-duration,2s) * .85);animation-delay:calc(var(--wavelo-duration,2s) * -.2);background:#38bdf8;box-shadow:0 0 5px #38bdf8}
.wavelo--solar-system .wavelo__part:nth-child(3){width:5.5px;height:5.5px;margin:-2.75px 0 0 -2.75px;--rx:calc(var(--wavelo-size,3rem) * .34);--ry:calc(var(--wavelo-size,3rem) * .187);animation-duration:calc(var(--wavelo-duration,2s) * 1.3);animation-delay:calc(var(--wavelo-duration,2s) * -.45);background:#f87171;box-shadow:0 0 4px #f87171}
.wavelo--solar-system .wavelo__part:nth-child(4){width:7px;height:7px;margin:-3.5px 0 0 -3.5px;--rx:calc(var(--wavelo-size,3rem) * .44);--ry:calc(var(--wavelo-size,3rem) * .242);animation-duration:calc(var(--wavelo-duration,2s) * 1.8);animation-delay:calc(var(--wavelo-duration,2s) * -.7);background:#fbbf24;box-shadow:0 0 4px #fbbf24}
.wavelo--solar-system .wavelo__part:nth-child(4):after{content:"";position:absolute;inset:-2px -4.5px;border:1.5px solid #fef08a;border-radius:50%;transform:rotate(-25deg);pointer-events:none}
.wavelo--solar-system .wavelo__part:nth-child(5){width:8.5px;height:8.5px;margin:-4.25px 0 0 -4.25px;--rx:calc(var(--wavelo-size,3rem) * .44);--ry:calc(var(--wavelo-size,3rem) * .242);animation-duration:calc(var(--wavelo-duration,2s) * 2.4);animation-delay:calc(var(--wavelo-duration,2s) * -1.2);background:#fb923c;box-shadow:0 0 5px #fb923c}
.wavelo--atom-orbital{position:relative;width:var(--wavelo-width,var(--wavelo-size,2.75rem));height:var(--wavelo-height,var(--wavelo-size,2.75rem));margin:auto;background:transparent;perspective:500px;transform-style:preserve-3d}
.wavelo--atom-orbital:before{content:"";position:absolute;left:50%;top:50%;width:24%;height:24%;margin:-12% 0 0 -12%;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff 0%,currentColor 40%,var(--wavelo-secondary-color,#ec4899) 75%,#3b82f6 100%);box-shadow:0 0 10px currentColor,0 0 18px rgba(236,72,153,.6);transform:translateZ(2px)}
.wavelo--atom-orbital .wavelo__part{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;width:92%;height:92%;border-radius:9999px;background:transparent;border:1.5px solid color-mix(in srgb,currentColor 45%,transparent);transform-style:preserve-3d;transform-origin:50% 50%}
.wavelo--atom-orbital .wavelo__part:after{content:"";position:absolute;top:-4px;left:50%;margin-left:-4px;width:8px;height:8px;border-radius:50%}
.wavelo--atom-orbital .wavelo__part:nth-child(1){border-color:color-mix(in srgb,#38bdf8 65%,transparent);animation:wavelo-atom-ring-1 var(--wavelo-duration,1.8s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--atom-orbital .wavelo__part:nth-child(1):after{background:#38bdf8;box-shadow:0 0 8px #38bdf8,0 0 14px #38bdf8,0 0 2px #fff}
.wavelo--atom-orbital .wavelo__part:nth-child(2){border-color:color-mix(in srgb,var(--wavelo-secondary-color,#a855f7) 65%,transparent);animation:wavelo-atom-ring-2 var(--wavelo-duration,1.8s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--atom-orbital .wavelo__part:nth-child(2):after{background:var(--wavelo-secondary-color,#a855f7);box-shadow:0 0 8px var(--wavelo-secondary-color,#a855f7),0 0 14px var(--wavelo-secondary-color,#a855f7),0 0 2px #fff}
.wavelo--atom-orbital .wavelo__part:nth-child(3){border-color:color-mix(in srgb,#34d399 65%,transparent);animation:wavelo-atom-ring-3 var(--wavelo-duration,1.8s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--atom-orbital .wavelo__part:nth-child(3):after{background:#34d399;box-shadow:0 0 8px #34d399,0 0 14px #34d399,0 0 2px #fff}
.wavelo--black-hole-accretion{position:relative;width:var(--wavelo-width,var(--wavelo-size,3rem));height:var(--wavelo-height,var(--wavelo-size,3rem));margin:auto;background:transparent;perspective:500px;transform-style:preserve-3d}
.wavelo--black-hole-accretion:before{content:"";position:absolute;left:50%;top:50%;width:32%;height:32%;margin:-16% 0 0 -16%;border-radius:50%;background:#000;border:1.5px solid #fff;box-shadow:0 0 10px #f97316,0 0 22px rgba(249,115,22,.7),inset 0 0 12px #000;transform:translateZ(6px);z-index:5}
.wavelo--black-hole-accretion .wavelo__part{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;border-radius:9999px;background:transparent;transform-style:preserve-3d;transform-origin:50% 50%}
.wavelo--black-hole-accretion .wavelo__part:nth-child(1){width:94%;height:94%;background:conic-gradient(from 0deg,#f97316 0%,#fde047 30%,#ef4444 65%,transparent 95%);-webkit-mask:radial-gradient(farthest-side,transparent 40%,#000 42%);mask:radial-gradient(farthest-side,transparent 40%,#000 42%);filter:drop-shadow(0 0 8px #f97316);animation:wavelo-accretion-spin calc(var(--wavelo-duration,2s) * .7) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--black-hole-accretion .wavelo__part:nth-child(2){width:98%;height:98%;background:conic-gradient(from 180deg,#fff 0%,#38bdf8 25%,transparent 60%);-webkit-mask:radial-gradient(farthest-side,transparent 46%,#000 48%);mask:radial-gradient(farthest-side,transparent 46%,#000 48%);filter:drop-shadow(0 0 6px #38bdf8);animation:wavelo-accretion-spin calc(var(--wavelo-duration,2s) * .9) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--black-hole-accretion .wavelo__part:nth-child(3){width:78%;height:78%;border:2px solid #fdba74;border-bottom-color:transparent;filter:drop-shadow(0 0 10px #f97316);animation:wavelo-accretion-lensing var(--wavelo-duration,2s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--magnetic-field{position:relative;width:var(--wavelo-width,var(--wavelo-size,2.75rem));height:var(--wavelo-height,var(--wavelo-size,3rem));margin:auto;background:transparent;border:0;perspective:500px;transform-style:preserve-3d;animation:wavelo-magnetic-spin calc(var(--wavelo-duration,2.5s) * 2.5) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--magnetic-field .wavelo__part{position:absolute;box-sizing:border-box;border-radius:9999px;transform-style:preserve-3d;transform-origin:50% 50%}
.wavelo--magnetic-field .wavelo__part:nth-child(1){width:9px;height:9px;left:calc(50% - 4.5px);top:8%;background:radial-gradient(circle at 35% 35%,#fff 0%,#38bdf8 70%,#0284c7 100%);box-shadow:0 0 10px #38bdf8,0 0 18px rgba(56,189,248,.6);animation:wavelo-magnetic-pole-n var(--wavelo-duration,2.5s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--magnetic-field .wavelo__part:nth-child(2){width:9px;height:9px;left:calc(50% - 4.5px);bottom:8%;background:radial-gradient(circle at 35% 35%,#fff 0%,var(--wavelo-secondary-color,#f43f5e) 70%,#be123c 100%);box-shadow:0 0 10px var(--wavelo-secondary-color,#f43f5e),0 0 18px rgba(244,63,94,.6);animation:wavelo-magnetic-pole-s var(--wavelo-duration,2.5s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--magnetic-field .wavelo__part:nth-child(3){width:60%;height:84%;inset:0;margin:auto;border-radius:9999px;background:transparent;border:1.5px solid color-mix(in srgb,currentColor 55%,transparent);border-top-color:#38bdf8;border-bottom-color:var(--wavelo-secondary-color,#f43f5e);box-shadow:0 0 8px color-mix(in srgb,#38bdf8 35%,transparent);animation:wavelo-magnetic-flux-1 var(--wavelo-duration,2.5s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--magnetic-field .wavelo__part:nth-child(4){width:88%;height:92%;inset:0;margin:auto;border-radius:9999px;background:transparent;border:1.5px dashed color-mix(in srgb,var(--wavelo-secondary-color,#f43f5e) 60%,transparent);border-top-color:#38bdf8;animation:wavelo-magnetic-flux-2 calc(var(--wavelo-duration,2.5s) * 1.3) linear infinite reverse var(--wavelo-play-state,running)}
${orbitFrames}${cometTailFrames}${fireflyFrames}${orbitRingFrames}${atomFrames}${blackHoleFrames}${magneticFrames}`;
