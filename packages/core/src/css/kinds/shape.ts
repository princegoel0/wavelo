import { css as shapeFrames } from '../keyframes/shape.js';
import { css as cubeFrames } from '../keyframes/cube.js';
import { css as polygonFrames } from '../keyframes/polygon.js';
import { css as triangleFrames } from '../keyframes/triangle.js';
import { css as foldFrames } from '../keyframes/fold.js';
import { css as triangleOrbitFrames } from '../keyframes/triangle-orbit.js';
import { css as diamondFrames } from '../keyframes/diamond.js';
import { css as morphFrames } from '../keyframes/morph.js';
import { css as blobFrames } from '../keyframes/blob.js';
import { css as starFrames } from '../keyframes/star.js';

export const shapeCss = `
.wavelo--shape{background:currentColor;border-radius:20%;animation:wavelo-shape var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--shape .wavelo__part{display:none}
.wavelo--cube{background:linear-gradient(135deg,currentColor 0 42%,transparent 42% 58%,currentColor 58%);border:var(--wavelo-stroke,3px) solid currentColor;transform-style:preserve-3d;animation:wavelo-cube var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--polygon{clip-path:polygon(50% 0,100% 35%,82% 100%,18% 100%,0 35%);animation:wavelo-polygon var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--triangles{clip-path:polygon(50% 0,100% 100%,0 100%);animation:wavelo-triangle var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--folding-squares{background:linear-gradient(90deg,currentColor 0 45%,transparent 45% 55%,currentColor 55%);animation:wavelo-fold var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--rotating-diamond{border-radius:10%;animation:wavelo-diamond var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--morphing-shapes{border-radius:0;animation:wavelo-morph var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--svg-star{background:transparent;border:0;clip-path:none;animation:none}
.wavelo--svg-star .wavelo__part{display:block;width:100%;height:100%;background:transparent;fill:currentColor;animation:wavelo-star var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--triangles .wavelo__part{position:absolute;width:35%;height:35%;clip-path:polygon(50% 0,100% 100%,0 100%);animation:wavelo-triangle-orbit var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--triangles .wavelo__part:nth-child(1){transform:translateY(-45%)}
.wavelo--triangles .wavelo__part:nth-child(2){transform:rotate(120deg) translateY(-45%);animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--triangles .wavelo__part:nth-child(3){transform:rotate(240deg) translateY(-45%);animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
/* The shape never moves; only its corners keep changing their radii, which is what
   makes it read as a liquid rather than a rotating box. */
.wavelo--liquid-blob{border-radius:58% 42% 55% 45%/48% 56% 44% 52%;animation:wavelo-blob calc(var(--wavelo-duration,1s) * 2) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${shapeFrames}${cubeFrames}${polygonFrames}${triangleFrames}${foldFrames}${triangleOrbitFrames}${diamondFrames}${morphFrames}${starFrames}${blobFrames}`;
