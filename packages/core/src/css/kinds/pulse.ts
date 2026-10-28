import { css as scaleDotFrames } from '../keyframes/scale-dot.js';

export const pulseCss = `
.wavelo--pulse .wavelo__part{width:55%;height:55%;border-radius:50%;animation:wavelo-pulse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--scaling-dots .wavelo__part{animation:wavelo-scale-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--button .wavelo__part{width:30%;height:30%;animation:wavelo-pulse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--inline .wavelo__part{width:18%;height:18%;animation:wavelo-bounce-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--pulsing-dots .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration) / -3)}
.wavelo--pulsing-dots .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration) * -2 / 3)}
.wavelo--expanding-dot .wavelo__part{width:70%;height:70%;animation:wavelo-scale-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--grid-pulse{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:calc(var(--wavelo-size) / 10);width:var(--wavelo-size);height:var(--wavelo-size);background:transparent}
.wavelo--grid-pulse .wavelo__part{width:100%;height:100%;border-radius:18%;animation:wavelo-pulse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--grid-pulse .wavelo__part:nth-child(2),.wavelo--grid-pulse .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration) / -2)}
${scaleDotFrames}`;
