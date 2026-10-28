import { css as fadeDotFrames } from '../keyframes/fade-dot.js';
import { css as altDotFrames } from '../keyframes/alt-dot.js';
import { css as altDotReverseFrames } from '../keyframes/alt-dot-reverse.js';
import { css as staggerDotFrames } from '../keyframes/stagger-dot.js';

export const dotsCss = `
.wavelo--dots{gap:calc(var(--wavelo-size) / 7)}
.wavelo--dots .wavelo__part{width:calc(var(--wavelo-size) / 5);height:calc(var(--wavelo-size) / 5);border-radius:50%;animation:wavelo-pulse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration) / -3)}
.wavelo--dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration) * -2 / 3)}
.wavelo--dots .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration) * -1 / 3)}
.wavelo--dots .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration) * -5 / 6)}
.wavelo--dotted-circle{display:block;border:0;background:transparent}
.wavelo--dotted-circle .wavelo__part{position:absolute;width:calc(var(--wavelo-size) / 7);height:calc(var(--wavelo-size) / 7);border-radius:50%;animation:wavelo-dot-orbit var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--dotted-circle .wavelo__part:nth-child(1){transform:rotate(0deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(2){transform:rotate(45deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(3){transform:rotate(90deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(4){transform:rotate(135deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(5){transform:rotate(180deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(6){transform:rotate(225deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(7){transform:rotate(270deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--dotted-circle .wavelo__part:nth-child(8){transform:rotate(315deg) translateY(calc(var(--wavelo-size) * -.36))}
.wavelo--bouncing-dots .wavelo__part{animation:wavelo-bounce-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--fading-dots .wavelo__part{animation:wavelo-fade-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--alternating-dots .wavelo__part:nth-child(odd){animation:wavelo-alt-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--alternating-dots .wavelo__part:nth-child(even){animation:wavelo-alt-dot-reverse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--staggered-dots .wavelo__part{animation:wavelo-stagger-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--infinite-scroll{gap:4px}
.wavelo--infinite-scroll .wavelo__part{width:12%;height:12%;animation:wavelo-bounce-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--dot-matrix{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:calc(var(--wavelo-size) / 14);width:var(--wavelo-size);height:var(--wavelo-size);background:transparent}
.wavelo--dot-matrix .wavelo__part{width:100%;height:100%;border-radius:22%;animation:wavelo-pulse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--dot-matrix .wavelo__part:nth-child(2),.wavelo--dot-matrix .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration) / -4)}
.wavelo--dot-matrix .wavelo__part:nth-child(3),.wavelo--dot-matrix .wavelo__part:nth-child(5),.wavelo--dot-matrix .wavelo__part:nth-child(7){animation-delay:calc(var(--wavelo-duration) / -2)}
.wavelo--dot-matrix .wavelo__part:nth-child(6),.wavelo--dot-matrix .wavelo__part:nth-child(8){animation-delay:calc(var(--wavelo-duration) * -3 / 4)}
${fadeDotFrames}${altDotFrames}${altDotReverseFrames}${staggerDotFrames}`;
