import { css as orbitFrames } from '../keyframes/orbit.js';

export const orbitCss = `
.wavelo--orbit .wavelo__part{position:absolute;width:25%;height:25%;border-radius:50%;transform-origin:200% 200%;animation:wavelo-orbit var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--orbit .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--orbit .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
.wavelo--orbit{display:block;background:transparent}
.wavelo--orbit.wavelo-inline{display:inline-block}
.wavelo--orbit .wavelo__part{position:absolute;left:50%;top:50%;width:18%;height:18%;transform-origin:0 0;animation:wavelo-orbit var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--orbit .wavelo__part:nth-child(1){--orbit-angle:0deg}
.wavelo--orbit .wavelo__part:nth-child(2){--orbit-angle:72deg}
.wavelo--orbit .wavelo__part:nth-child(3){--orbit-angle:144deg}
.wavelo--orbit .wavelo__part:nth-child(4){--orbit-angle:216deg}
.wavelo--orbit .wavelo__part:nth-child(5){--orbit-angle:288deg}
.wavelo--orbiting-circles .wavelo__part{width:25%;height:25%;background:transparent;border:var(--wavelo-stroke,3px) solid currentColor}
.wavelo--particle-orbit .wavelo__part{width:10%;height:10%;box-shadow:0 0 0 2px color-mix(in srgb,currentColor 30%,transparent)}
.wavelo--rotating-dots .wavelo__part{animation:wavelo-dot-orbit var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
${orbitFrames}`;
