export const ringCss = `
.wavelo--ring{border:var(--wavelo-stroke) solid currentColor;border-right-color:transparent;border-radius:50%;animation:wavelo-spin var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--gradient-ring{border-image:linear-gradient(currentColor,var(--wavelo-secondary-color,#a5b4fc)) 1;border-radius:50%}
.wavelo--half-circle{border-bottom-color:transparent;border-left-color:transparent}
.wavelo--ellipse{width:var(--wavelo-width);height:calc(var(--wavelo-height) / 2)}
.wavelo--radar{border:var(--wavelo-stroke) solid currentColor;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 300deg,currentColor 355deg,transparent);animation:wavelo-radar var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--spiral{background:conic-gradient(transparent 0 20deg,currentColor 25deg 35deg,transparent 40deg 80deg,currentColor 85deg 95deg,transparent 100deg);border-radius:50%;animation:wavelo-spin var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
`;
