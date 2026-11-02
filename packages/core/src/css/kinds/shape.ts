import { css as shapeFrames } from '../keyframes/shape.js';
import { css as squareFrames } from '../keyframes/square.js';
import { css as cubeFrames } from '../keyframes/cube.js';
import { css as polygonFrames } from '../keyframes/polygon.js';
import { css as foldFrames } from '../keyframes/fold.js';
import { css as triangleOrbitFrames } from '../keyframes/triangle-orbit.js';
import { css as morphFrames } from '../keyframes/morph.js';
import { css as blobFrames } from '../keyframes/blob.js';
import { css as sandFrames } from '../keyframes/sand.js';
import { css as sandTopFrames } from '../keyframes/sand-top.js';
import { css as sandBottomFrames } from '../keyframes/sand-bottom.js';
import { css as blinkEyeFrames } from '../keyframes/blink-eye.js';
import { css as eyeLookFrames } from '../keyframes/eye-look.js';
import { css as metronomeFrames } from '../keyframes/metronome.js';
import { css as starFrames } from '../keyframes/star.js';
import { css as shakeFrames } from '../keyframes/shake.js';
import { css as tesseractFrames } from '../keyframes/tesseract.js';
import { css as prismFrames } from '../keyframes/prism.js';
import { css as holoFrames } from '../keyframes/holo-spin.js';
import { css as crystalFrames } from '../keyframes/crystal.js';
import { css as deckFrames } from '../keyframes/deck-shuffle.js';
import { css as voxelFrames } from '../keyframes/voxel.js';
import { css as mercuryFrames } from '../keyframes/mercury.js';

export const shapeCss = `
.wavelo--shape{background:currentColor;border-radius:20%;animation:wavelo-shape var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--shape .wavelo__part{display:none}
.wavelo--cube{position:relative;background:transparent;border:0;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));margin:auto;perspective:400px;transform-style:preserve-3d;animation:wavelo-cube var(--wavelo-duration,2s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--cube:after{content:"";position:absolute;bottom:-8%;left:15%;width:70%;height:20%;border-radius:50%;background:radial-gradient(ellipse at center,color-mix(in srgb,currentColor 45%,transparent) 0%,transparent 70%);animation:wavelo-cube-shadow var(--wavelo-duration,2s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--cube .wavelo__part{display:block;position:absolute;width:52%;height:52%;inset:0;margin:auto;box-sizing:border-box;border:var(--wavelo-stroke,1.5px) solid currentColor;backface-visibility:visible;transform-style:preserve-3d}
.wavelo--cube .wavelo__part:nth-child(1){transform:rotateX(90deg) translateZ(calc(var(--wavelo-size,2.5rem) * .26));background:color-mix(in srgb,#fff 40%,color-mix(in srgb,var(--wavelo-secondary-color,currentColor) 45%,transparent));border-color:color-mix(in srgb,#fff 70%,var(--wavelo-secondary-color,currentColor));box-shadow:inset 0 0 8px rgba(255,255,255,.4)}
.wavelo--cube .wavelo__part:nth-child(2){transform:rotateY(0deg) translateZ(calc(var(--wavelo-size,2.5rem) * .26));background:color-mix(in srgb,currentColor 35%,transparent);border-color:currentColor;box-shadow:inset 0 0 8px color-mix(in srgb,currentColor 40%,transparent)}
.wavelo--cube .wavelo__part:nth-child(3){transform:rotateY(90deg) translateZ(calc(var(--wavelo-size,2.5rem) * .26));background:color-mix(in srgb,currentColor 20%,transparent);border-color:color-mix(in srgb,currentColor 65%,transparent);box-shadow:inset 0 0 8px color-mix(in srgb,currentColor 30%,transparent)}
.wavelo--polygon{position:relative;background:transparent;border:0;display:inline-flex;align-items:center;justify-content:center}
.wavelo--polygon:before{content:"";position:absolute;inset:0;clip-path:polygon(50% 0%,100% 38%,81% 100%,19% 100%,0% 38%);background:linear-gradient(135deg,color-mix(in srgb,currentColor 85%,transparent),color-mix(in srgb,var(--wavelo-secondary-color,currentColor) 45%,transparent));box-shadow:0 0 16px color-mix(in srgb,currentColor 40%,transparent);animation:wavelo-polygon var(--wavelo-duration,2.5s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--polygon .wavelo__part{display:block;position:absolute;inset:16%;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);background:var(--wavelo-secondary-color,currentColor);box-shadow:0 0 12px color-mix(in srgb,var(--wavelo-secondary-color,currentColor) 80%,transparent);animation:wavelo-poly-inner var(--wavelo-duration,2.5s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--polygon:after{content:"";position:absolute;width:12%;height:12%;border-radius:50%;background:#fff;box-shadow:0 0 8px #fff;animation:wavelo-poly-pulse calc(var(--wavelo-duration,2.5s) * .5) ease-in-out infinite var(--wavelo-play-state,running)}
/* Three triangles orbiting a centre. The root draws nothing: a clip-path here would
   clip its own subtree, and that is what had this design showing one spinning triangle —
   the three orbiting parts existed but were cut away to the root's own silhouette. */
.wavelo--triangles{background:transparent;clip-path:none;animation:none}
.wavelo--folding-squares{position:relative;background:transparent;border:0;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));perspective:300px;transform-style:preserve-3d;transform:rotateZ(45deg);animation:wavelo-fold var(--wavelo-duration,2s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--folding-squares .wavelo__part{display:block;position:absolute;width:46%;height:46%;box-sizing:border-box;border-radius:var(--wavelo-radius,3px);border:var(--wavelo-stroke,2px) solid currentColor;background:color-mix(in srgb,currentColor 30%,transparent);backface-visibility:hidden;transform-style:preserve-3d}
.wavelo--folding-squares .wavelo__part:nth-child(1){top:2%;left:2%;transform-origin:100% 100%;animation:wavelo-fold-tl var(--wavelo-duration,2s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--folding-squares .wavelo__part:nth-child(2){top:2%;right:2%;transform-origin:0% 100%;animation:wavelo-fold-tr var(--wavelo-duration,2s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,2s) * .15);color:var(--wavelo-secondary-color,currentColor)}
.wavelo--folding-squares .wavelo__part:nth-child(3){bottom:2%;right:2%;transform-origin:0% 0%;animation:wavelo-fold-br var(--wavelo-duration,2s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,2s) * .3)}
.wavelo--folding-squares .wavelo__part:nth-child(4){bottom:2%;left:2%;transform-origin:100% 0%;animation:wavelo-fold-bl var(--wavelo-duration,2s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,2s) * .45);color:var(--wavelo-secondary-color,currentColor)}
/* The only design that was riding the kind's default rule, and the default morphs
   border-radius to 50% — so "Rotating square" spent half of every cycle as a circle. It
   now keeps its corners and turns about its vertical axis, which is what makes the
   rotation visible on a four-fold symmetric shape: an in-plane spin of a square looks
   identical every quarter turn. */
.wavelo--rotating-square{border-radius:8%;animation:wavelo-square var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--morphing-shapes{border-radius:0;animation:wavelo-morph var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--svg-star{background:transparent;border:0;clip-path:none;animation:none}
.wavelo--svg-star .wavelo__part{display:block;width:100%;height:100%;background:transparent;fill:currentColor;animation:wavelo-star var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--triangles .wavelo__part{display:block;position:absolute;left:50%;top:50%;width:32%;height:32%;margin:-16% 0 0 -16%;clip-path:polygon(50% 0,100% 100%,0 100%);background:linear-gradient(135deg,currentColor,var(--wavelo-secondary-color,currentColor));--a:0deg;animation:wavelo-triangle-orbit var(--wavelo-duration,2s) cubic-bezier(.45,.05,.55,.95) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--triangles .wavelo__part:nth-child(2){--a:120deg;animation-delay:calc(var(--wavelo-duration,2s) / -3)}
.wavelo--triangles .wavelo__part:nth-child(3){--a:240deg;animation-delay:calc(var(--wavelo-duration,2s) * -2 / 3)}
/* The shape never moves; only its corners keep changing their radii, which is what
   makes it read as a liquid rather than a rotating box. */
.wavelo--liquid-blob{width:var(--wavelo-width,var(--wavelo-size,2.75rem));height:var(--wavelo-height,var(--wavelo-size,2.75rem));position:relative;border-radius:60% 40% 30% 70%/60% 30% 70% 40%;background:radial-gradient(circle at 35% 32%,color-mix(in srgb,currentColor 55%,#fff) 0%,currentColor 65%,color-mix(in srgb,currentColor 75%,#000) 100%);box-shadow:0 6px 16px -2px color-mix(in srgb,currentColor 45%,transparent);animation:wavelo-blob calc(var(--wavelo-duration,1s) * 2.5) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--liquid-blob .wavelo__part{display:none}
.wavelo--liquid-blob:after{content:"";position:absolute;top:18%;left:22%;width:26%;height:18%;border-radius:50%;background:rgba(255,255,255,.7);transform:rotate(-35deg);filter:blur(.5px)}
/* An hourglass that runs down. The root is the glass: a silhouette clipped to two
   chambers meeting at a neck, with caps and a standing channel drawn as background
   layers. The upper chamber drains toward the neck and the lower one fills from its
   own floor, so each pseudo scales about the end the sand rests against. The channel is
   never animated: it is painted over by the mound as it rises, which is exactly the
   part of a real stream you can see. The whole timer turns over once the lower glass is
   full, and because a half-turn of a full-bottom hourglass is a full-top one, the loop
   boundary continues the story instead of resetting it. */
.wavelo--sand-timer{position:relative;width:calc(var(--wavelo-width,var(--wavelo-size,2.5rem)) * .75);height:var(--wavelo-height,var(--wavelo-size,2.5rem));clip-path:polygon(14% 0,86% 0,54% 48%,54% 52%,86% 100%,14% 100%,46% 52%,46% 48%);border-radius:0;background:linear-gradient(currentColor,currentColor) 0 0/100% 7% no-repeat,linear-gradient(currentColor,currentColor) 0 100%/100% 7% no-repeat,color-mix(in srgb,currentColor 18%,transparent);animation:wavelo-sand calc(var(--wavelo-duration,1s) * 6) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--sand-timer:before,.wavelo--sand-timer:after{content:"";position:absolute;inset:0;background:var(--wavelo-secondary-color,currentColor);animation-duration:calc(var(--wavelo-duration,1s) * 6);animation-timing-function:linear;animation-iteration-count:infinite;animation-direction:var(--wavelo-direction,normal);animation-play-state:var(--wavelo-play-state,running)}
.wavelo--sand-timer:before{clip-path:polygon(14% 6%,86% 6%,52% 50%,48% 50%);transform-origin:50% 50%;animation-name:wavelo-sand-top}
.wavelo--sand-timer:after{clip-path:polygon(48% 50%,52% 50%,86% 94%,14% 94%);transform-origin:50% 94%;animation-name:wavelo-sand-bottom}
.wavelo--sand-timer .wavelo__part{display:block;position:absolute;left:calc(50% - 1px);top:48%;width:2px;height:44%;background:repeating-linear-gradient(180deg,var(--wavelo-secondary-color,currentColor) 0 4px,transparent 4px 7px);background-size:2px 14px;animation:wavelo-sand-stream .35s linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* An eye, not an ellipse. The opening is an almond with pointed corners and a
   translucent sclera; the iris is its own disc carrying a pupil and a catchlight, so it
   can glance aside while the lid is up. The lid is a panel parked above the opening and
   dropped down over it — the root's clip-path clips its whole subtree, so the lid enters
   and leaves through the eye's own corners instead of squashing the picture. */
.wavelo--eye-blink{width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,calc(var(--wavelo-width,var(--wavelo-size,2.5rem)) * .58));border-radius:0;clip-path:polygon(0 50%,10% 30%,25% 16%,50% 10%,75% 16%,90% 30%,100% 50%,90% 70%,75% 84%,50% 90%,25% 84%,10% 70%);background:color-mix(in srgb,currentColor 14%,transparent);animation:none}
.wavelo--eye-blink:before{content:"";position:absolute;left:50%;top:50%;width:calc(var(--wavelo-size,2.5rem) * .4);height:calc(var(--wavelo-size,2.5rem) * .4);margin:calc(var(--wavelo-size,2.5rem) * -.2) 0 0 calc(var(--wavelo-size,2.5rem) * -.2);border-radius:50%;background:radial-gradient(circle,#0b1020 0 42%,transparent 42%),radial-gradient(circle at 32% 28%,#fff 0 15%,transparent 15%),currentColor;animation:wavelo-eye-look calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--eye-blink:after{content:"";position:absolute;inset:0;background:currentColor;transform:translateY(-104%);animation:wavelo-blink-eye calc(var(--wavelo-duration,1s) * 3) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A metronome arm swinging about its foot. */
.wavelo--metronome{width:var(--wavelo-width,calc(var(--wavelo-size,2.5rem) * .28));height:var(--wavelo-height,var(--wavelo-size,2.5rem));border-radius:var(--wavelo-radius,2px);transform-origin:50% 96%;animation:wavelo-metronome calc(var(--wavelo-duration,1s) * 1.2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* The badge is painted by the alert token and the halo by the accent token, which is what
   keeps both defaults singular. Painting the badge through currentColor would have meant
   defaulting it with a second fallback on --wavelo-color, and the generated tokens sheet
   declares a property only where every rule that reads it agrees on one default — so one
   design disagreeing silently dropped a public token from that sheet. A design called
   error-shake is red when nobody tells it otherwise, and still answers color: its halo. */
.wavelo--error-shake{background:var(--wavelo-error-color,#ef4444);border-radius:var(--wavelo-radius,8px);position:relative;display:inline-grid;place-items:center;box-shadow:0 4px 14px color-mix(in srgb,var(--wavelo-color,#6366f1) 35%,transparent);animation:wavelo-shake calc(var(--wavelo-duration,1s) * 1.2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--error-shake .wavelo__part{display:none}
.wavelo--error-shake:after{content:"!";font-weight:800;font-family:system-ui,-apple-system,sans-serif;font-size:calc(var(--wavelo-size,2.5rem) * .58);color:#fff;line-height:1}
.wavelo--error-shake[data-wavelo-state="error"]{animation:wavelo-shake calc(var(--wavelo-duration,1s) * .6) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--error-shake[data-wavelo-state="success"]{background:var(--wavelo-success-color,#22c55e);animation:none}
.wavelo--error-shake[data-wavelo-state="success"]:after{content:"\\2713"}
.wavelo--error-shake[data-wavelo-state="idle"]{animation:none;opacity:.7}
.wavelo--tesseract{position:relative;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));margin:auto;background:transparent;border:0;perspective:400px;transform-style:preserve-3d}
.wavelo--tesseract:before{content:"";position:absolute;inset:16%;border:1.5px dashed color-mix(in srgb,currentColor 45%,transparent);transform:rotate(45deg);opacity:.7}
.wavelo--tesseract .wavelo__part{display:block;position:absolute;inset:0;margin:auto;border-radius:12%;background:transparent;border:var(--wavelo-stroke,2px) solid currentColor;box-shadow:inset 0 0 8px color-mix(in srgb,currentColor 30%,transparent),0 0 8px color-mix(in srgb,currentColor 35%,transparent);transform-style:preserve-3d}
.wavelo--tesseract .wavelo__part:nth-child(1){width:84%;height:84%;animation:wavelo-tesseract-outer var(--wavelo-duration,2.6s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--tesseract .wavelo__part:nth-child(2){width:44%;height:44%;border-color:var(--wavelo-secondary-color,#38bdf8);box-shadow:inset 0 0 8px rgba(56,189,248,.35),0 0 10px var(--wavelo-secondary-color,#38bdf8);animation:wavelo-tesseract-inner var(--wavelo-duration,2.6s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--prism-refraction{position:relative;width:var(--wavelo-width,var(--wavelo-size,2.75rem));height:var(--wavelo-height,var(--wavelo-size,2.75rem));margin:auto;background:transparent;border:0;perspective:400px;transform-style:preserve-3d}
.wavelo--prism-refraction:before{content:"";position:absolute;left:0;top:48%;width:34%;height:2px;background:linear-gradient(90deg,transparent,#fff 40%,#fff 100%);box-shadow:0 0 8px #fff,0 0 14px rgba(255,255,255,.8);z-index:2}
.wavelo--prism-refraction .wavelo__part{display:block;position:absolute;transform-style:preserve-3d}
.wavelo--prism-refraction .wavelo__part:nth-child(1){left:28%;top:14%;width:42%;height:68%;clip-path:polygon(50% 0%,0% 100%,100% 100%);background:linear-gradient(135deg,rgba(255,255,255,.85) 0%,rgba(147,197,253,.35) 45%,rgba(255,255,255,.1) 100%);filter:drop-shadow(0 0 8px rgba(255,255,255,.4));border-bottom:2px solid #fff;animation:wavelo-prism-spin var(--wavelo-duration,2.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--prism-refraction .wavelo__part:nth-child(2){left:32%;top:18%;width:34%;height:60%;clip-path:polygon(50% 0%,100% 100%,50% 100%);background:linear-gradient(180deg,rgba(255,255,255,.5),rgba(59,130,246,.2));animation:wavelo-prism-spin var(--wavelo-duration,2.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running);animation-delay:calc(var(--wavelo-duration,2.4s) * -.5)}
.wavelo--prism-refraction .wavelo__part:nth-child(3){left:54%;top:32%;width:44%;height:44%;clip-path:polygon(0 45%,100% 0%,100% 100%,0 55%);background:linear-gradient(to bottom,#ef4444 0%,#f97316 16%,#eab308 33%,#22c55e 50%,#06b6d4 66%,#3b82f6 83%,#a855f7 100%);filter:drop-shadow(0 0 10px rgba(234,179,8,.5));transform-origin:0% 50%;animation:wavelo-prism-beam var(--wavelo-duration,2.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--hologram-pyramid{position:relative;background:transparent;border:0;perspective:500px;transform-style:preserve-3d}
.wavelo--hologram-pyramid:after{content:"";position:absolute;bottom:0;left:15%;width:70%;height:14%;border-radius:9999px;border:1.5px solid color-mix(in srgb,currentColor 50%,#38bdf8);box-shadow:0 0 10px color-mix(in srgb,currentColor 60%,#38bdf8);transform:rotateX(65deg)}
.wavelo--hologram-pyramid .wavelo__part{display:block;position:absolute;transform-style:preserve-3d}
.wavelo--hologram-pyramid .wavelo__part:nth-child(1){left:20%;top:12%;width:60%;height:60%;clip-path:polygon(50% 100%,5% 0%,95% 0%);background:linear-gradient(180deg,color-mix(in srgb,currentColor 45%,transparent),color-mix(in srgb,currentColor 85%,#38bdf8));box-shadow:inset 0 0 8px currentColor;animation:wavelo-holo-spin var(--wavelo-duration,2.4s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--hologram-pyramid .wavelo__part:nth-child(2){left:28%;top:20%;width:44%;height:44%;clip-path:polygon(50% 100%,10% 0%,90% 0%);background:color-mix(in srgb,var(--wavelo-secondary-color,#38bdf8) 35%,transparent);animation:wavelo-holo-spin var(--wavelo-duration,2.4s) linear infinite reverse var(--wavelo-play-state,running)}
.wavelo--hologram-pyramid .wavelo__part:nth-child(3){left:22.5%;top:35%;width:55%;height:2px;background:color-mix(in srgb,#fff 80%,currentColor);box-shadow:0 0 8px #fff,0 0 14px currentColor;animation:wavelo-holo-scan calc(var(--wavelo-duration,2.4s) * .6) ease-in-out infinite alternate var(--wavelo-play-state,running)}
.wavelo--hologram-pyramid .wavelo__part:nth-child(4){left:calc(50% - 3px);bottom:26%;width:6px;height:6px;border-radius:9999px;background:#fff;box-shadow:0 0 8px #fff}
.wavelo--crystal-cluster{position:relative;width:var(--wavelo-width,var(--wavelo-size,2.75rem));height:var(--wavelo-height,var(--wavelo-size,3rem));margin:auto;background:transparent;border:0;perspective:500px;transform-style:preserve-3d}
.wavelo--crystal-cluster:before{content:"";position:absolute;left:47%;top:6%;width:6px;height:6px;border-radius:50%;background:#fff;box-shadow:0 0 10px #fff,0 0 20px #c084fc;z-index:5}
.wavelo--crystal-cluster .wavelo__part{display:block;position:absolute;transform-style:preserve-3d}
.wavelo--crystal-cluster .wavelo__part:nth-child(1){left:33%;top:8%;width:34%;height:84%;clip-path:polygon(50% 0%,100% 25%,85% 100%,15% 100%,0% 25%);background:linear-gradient(110deg,#fff 0%,#c084fc 30%,#8b5cf6 65%,#4c1d95 100%);filter:drop-shadow(0 0 8px rgba(168,85,247,.6));animation:wavelo-crystal-1 var(--wavelo-duration,3s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--crystal-cluster .wavelo__part:nth-child(2){left:14%;top:24%;width:28%;height:66%;clip-path:polygon(50% 0%,100% 25%,85% 100%,15% 100%,0% 25%);background:linear-gradient(110deg,#fff 0%,#38bdf8 35%,#0284c7 70%,#0f172a 100%);filter:drop-shadow(0 0 6px rgba(56,189,248,.5));animation:wavelo-crystal-2 calc(var(--wavelo-duration,3s) * 1.1) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--crystal-cluster .wavelo__part:nth-child(3){left:56%;top:34%;width:30%;height:56%;clip-path:polygon(50% 0%,100% 25%,85% 100%,15% 100%,0% 25%);background:linear-gradient(110deg,#fff 0%,#f472b6 35%,#db2777 70%,#4c0519 100%);filter:drop-shadow(0 0 6px rgba(244,114,182,.5));animation:wavelo-crystal-3 calc(var(--wavelo-duration,3s) * .95) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--isometric-deck{position:relative;background:transparent;border:0;perspective:400px;transform-style:preserve-3d}
.wavelo--isometric-deck .wavelo__part{display:block;position:absolute;box-sizing:border-box;border-radius:var(--wavelo-radius,6px);border:1.5px solid currentColor;transform-style:preserve-3d}
.wavelo--isometric-deck .wavelo__part:nth-child(1){width:58%;height:58%;left:21%;top:21%;background:color-mix(in srgb,currentColor 35%,transparent);box-shadow:0 0 10px color-mix(in srgb,currentColor 25%,transparent);animation:wavelo-deck-card-1 var(--wavelo-duration,2.4s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--isometric-deck .wavelo__part:nth-child(2){width:56%;height:56%;left:22%;top:22%;background:color-mix(in srgb,var(--wavelo-secondary-color,#38bdf8) 25%,transparent);border-color:color-mix(in srgb,currentColor 70%,#38bdf8);animation:wavelo-deck-card-2 var(--wavelo-duration,2.4s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--isometric-deck .wavelo__part:nth-child(3){width:54%;height:54%;left:23%;top:23%;background:color-mix(in srgb,currentColor 18%,transparent);animation:wavelo-deck-card-3 var(--wavelo-duration,2.4s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--isometric-deck .wavelo__part:nth-child(4){width:52%;height:52%;left:24%;top:24%;background:color-mix(in srgb,currentColor 12%,transparent);animation:wavelo-deck-card-4 var(--wavelo-duration,2.4s) cubic-bezier(.4,0,.2,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--voxel-cluster{position:relative;background:transparent;border:0;perspective:450px;transform-style:preserve-3d;animation:wavelo-voxel-spin var(--wavelo-duration,3s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--voxel-cluster .wavelo__part{display:block;position:absolute;box-sizing:border-box;border-radius:4px;border:1.5px solid currentColor;transform-style:preserve-3d}
.wavelo--voxel-cluster .wavelo__part:nth-child(1){width:34%;height:34%;left:14%;top:14%;background:color-mix(in srgb,currentColor 75%,#fff);animation:wavelo-voxel-tl var(--wavelo-duration,3s) cubic-bezier(.34,1.56,.64,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--voxel-cluster .wavelo__part:nth-child(2){width:32%;height:32%;right:14%;top:15%;background:var(--wavelo-secondary-color,color-mix(in srgb,currentColor 60%,#38bdf8));border-color:var(--wavelo-secondary-color,#38bdf8);animation:wavelo-voxel-tr var(--wavelo-duration,3s) cubic-bezier(.34,1.56,.64,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--voxel-cluster .wavelo__part:nth-child(3){width:36%;height:36%;right:13%;bottom:13%;background:color-mix(in srgb,currentColor 45%,transparent);animation:wavelo-voxel-br var(--wavelo-duration,3s) cubic-bezier(.34,1.56,.64,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--voxel-cluster .wavelo__part:nth-child(4){width:30%;height:30%;left:16%;bottom:16%;background:color-mix(in srgb,currentColor 30%,transparent);animation:wavelo-voxel-bl var(--wavelo-duration,3s) cubic-bezier(.34,1.56,.64,1) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--liquid-mercury{position:relative;background:transparent;border:0;perspective:450px;transform-style:preserve-3d}
.wavelo--liquid-mercury .wavelo__part{display:block;position:absolute;box-sizing:border-box;border-radius:9999px;transform-style:preserve-3d}
.wavelo--liquid-mercury .wavelo__part:nth-child(1){width:58%;height:58%;left:21%;top:21%;background:radial-gradient(circle at 35% 35%,#fff 0%,color-mix(in srgb,currentColor 85%,#94a3b8) 40%,color-mix(in srgb,currentColor 40%,#0f172a) 100%);box-shadow:0 0 12px color-mix(in srgb,currentColor 40%,transparent);animation:wavelo-mercury-core var(--wavelo-duration,2.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--liquid-mercury .wavelo__part:nth-child(2){width:22%;height:22%;left:39%;top:39%;background:radial-gradient(circle at 35% 35%,#fff 0%,var(--wavelo-secondary-color,color-mix(in srgb,currentColor 70%,#38bdf8)) 60%,color-mix(in srgb,currentColor 30%,#0284c7) 100%);animation:wavelo-mercury-bead-1 var(--wavelo-duration,2.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--liquid-mercury .wavelo__part:nth-child(3){width:18%;height:18%;left:41%;top:41%;background:radial-gradient(circle at 30% 30%,#fff 0%,currentColor 70%,#000 100%);animation:wavelo-mercury-bead-2 var(--wavelo-duration,2.4s) ease-in-out infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${shapeFrames}${squareFrames}${cubeFrames}${polygonFrames}${foldFrames}${triangleOrbitFrames}${morphFrames}${starFrames}${blobFrames}${sandFrames}${sandTopFrames}${sandBottomFrames}${blinkEyeFrames}${eyeLookFrames}${metronomeFrames}${shakeFrames}${tesseractFrames}${prismFrames}${holoFrames}${crystalFrames}${deckFrames}${voxelFrames}${mercuryFrames}`;
