import { css as shapeFrames } from '../keyframes/shape.js';
import { css as squareFrames } from '../keyframes/square.js';
import { css as cubeFrames } from '../keyframes/cube.js';
import { css as polygonFrames } from '../keyframes/polygon.js';
import { css as foldFrames } from '../keyframes/fold.js';
import { css as triangleOrbitFrames } from '../keyframes/triangle-orbit.js';
import { css as diamondFrames } from '../keyframes/diamond.js';
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

export const shapeCss = `
.wavelo--shape{background:currentColor;border-radius:20%;animation:wavelo-shape var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--shape .wavelo__part{display:none}
.wavelo--cube{background:linear-gradient(135deg,currentColor 0 42%,transparent 42% 58%,currentColor 58%);border:var(--wavelo-stroke,3px) solid currentColor;transform-style:preserve-3d;animation:wavelo-cube var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--polygon{clip-path:polygon(50% 0,100% 35%,82% 100%,18% 100%,0 35%);animation:wavelo-polygon var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Three triangles orbiting a centre. The root draws nothing: a clip-path here would
   clip its own subtree, and that is what had this design showing one spinning triangle —
   the three orbiting parts existed but were cut away to the root's own silhouette. */
.wavelo--triangles{background:transparent;clip-path:none;animation:none}
.wavelo--folding-squares{background:linear-gradient(90deg,currentColor 0 45%,transparent 45% 55%,currentColor 55%);animation:wavelo-fold var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* The only design that was riding the kind's default rule, and the default morphs
   border-radius to 50% — so "Rotating square" spent half of every cycle as a circle. It
   now keeps its corners and turns about its vertical axis, which is what makes the
   rotation visible on a four-fold symmetric shape: an in-plane spin of a square looks
   identical every quarter turn. */
.wavelo--rotating-square{border-radius:8%;animation:wavelo-square var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* A rhombus, not a square caught at 45 degrees. A square spun in-plane is a square again
   every quarter turn, so half of this design's cycle read as rotating-square; making it
   taller than wide means every orientation is still a diamond. */
.wavelo--rotating-diamond{width:calc(var(--wavelo-width,var(--wavelo-size,2.5rem)) * .72);border-radius:12%;animation:wavelo-diamond var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--morphing-shapes{border-radius:0;animation:wavelo-morph var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--svg-star{background:transparent;border:0;clip-path:none;animation:none}
.wavelo--svg-star .wavelo__part{display:block;width:100%;height:100%;background:transparent;fill:currentColor;animation:wavelo-star var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--triangles .wavelo__part{display:block;position:absolute;left:50%;top:50%;width:35%;height:35%;margin:-17.5% 0 0 -17.5%;clip-path:polygon(50% 0,100% 100%,0 100%);--a:0deg;animation:wavelo-triangle-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--triangles .wavelo__part:nth-child(2){--a:120deg;animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--triangles .wavelo__part:nth-child(3){--a:240deg;animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
/* The shape never moves; only its corners keep changing their radii, which is what
   makes it read as a liquid rather than a rotating box. */
.wavelo--liquid-blob{border-radius:58% 42% 55% 45%/48% 56% 44% 52%;animation:wavelo-blob calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* An hourglass that runs down. The root is the glass: a silhouette clipped to two
   chambers meeting at a neck, with caps and a standing channel drawn as background
   layers. The upper chamber drains toward the neck and the lower one fills from its
   own floor, so each pseudo scales about the end the sand rests against. The channel is
   never animated: it is painted over by the mound as it rises, which is exactly the
   part of a real stream you can see. The whole timer turns over once the lower glass is
   full, and because a half-turn of a full-bottom hourglass is a full-top one, the loop
   boundary continues the story instead of resetting it. */
.wavelo--sand-timer{clip-path:polygon(16% 0,84% 0,54% 47%,54% 53%,84% 100%,16% 100%,46% 53%,46% 47%);border-radius:0;background:linear-gradient(currentColor,currentColor) 0 0/100% 7% no-repeat,linear-gradient(currentColor,currentColor) 0 100%/100% 7% no-repeat,linear-gradient(currentColor,currentColor) 50% 50%/2px 43% no-repeat,color-mix(in srgb,currentColor 22%,transparent);animation:wavelo-sand calc(var(--wavelo-duration,1s) * 6) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--sand-timer:before,.wavelo--sand-timer:after{content:"";position:absolute;inset:0;background:currentColor;animation-duration:calc(var(--wavelo-duration,1s) * 6);animation-timing-function:linear;animation-iteration-count:infinite;animation-direction:var(--wavelo-direction,normal);animation-play-state:var(--wavelo-play-state,running)}
.wavelo--sand-timer:before{clip-path:polygon(16% 6%,84% 6%,52% 50%,48% 50%);transform-origin:50% 50%;animation-name:wavelo-sand-top}
.wavelo--sand-timer:after{clip-path:polygon(48% 50%,52% 50%,84% 94%,16% 94%);transform-origin:50% 94%;animation-name:wavelo-sand-bottom}
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
.wavelo--error-shake{background:currentColor;border-radius:var(--wavelo-radius,8px);position:relative;display:inline-grid;place-items:center}
.wavelo--error-shake[data-wavelo-state="error"]{background:var(--wavelo-error-color,#ef4444);animation:wavelo-shake calc(var(--wavelo-duration,1s) * .45) ease-in-out}
.wavelo--error-shake[data-wavelo-state="error"]:after{content:"!";font-weight:700;font-size:calc(var(--wavelo-size,2.5rem) * .55);color:#fff;line-height:1}
.wavelo--error-shake[data-wavelo-state="success"]{background:var(--wavelo-success-color,#22c55e);animation:none}
.wavelo--error-shake[data-wavelo-state="success"]:after{content:"\\2713";font-weight:700;font-size:calc(var(--wavelo-size,2.5rem) * .55);color:#fff;line-height:1}
.wavelo--error-shake[data-wavelo-state="idle"]{animation:none;opacity:.7}
${shapeFrames}${squareFrames}${cubeFrames}${polygonFrames}${foldFrames}${triangleOrbitFrames}${diamondFrames}${morphFrames}${starFrames}${blobFrames}${sandFrames}${sandTopFrames}${sandBottomFrames}${blinkEyeFrames}${eyeLookFrames}${metronomeFrames}${shakeFrames}`;
