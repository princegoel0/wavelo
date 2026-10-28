export const shapeCss = `
.wavelo--shape{background:currentColor;border-radius:20%;animation:wavelo-shape var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--shape .wavelo__part{display:none}
.wavelo--cube{background:linear-gradient(135deg,currentColor 0 42%,transparent 42% 58%,currentColor 58%);border:var(--wavelo-stroke) solid currentColor;transform-style:preserve-3d;animation:wavelo-cube var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--polygon{clip-path:polygon(50% 0,100% 35%,82% 100%,18% 100%,0 35%);animation:wavelo-polygon var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--triangles{clip-path:polygon(50% 0,100% 100%,0 100%);animation:wavelo-triangle var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--folding-squares{background:linear-gradient(90deg,currentColor 0 45%,transparent 45% 55%,currentColor 55%);animation:wavelo-fold var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--rotating-diamond{transform:rotate(45deg);border-radius:10%}
.wavelo--svg-star{clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 100%,50% 73%,21% 100%,32% 57%,2% 35%,39% 35%)}
.wavelo--triangles .wavelo__part{position:absolute;width:35%;height:35%;clip-path:polygon(50% 0,100% 100%,0 100%);animation:wavelo-triangle-orbit var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--triangles .wavelo__part:nth-child(1){transform:translateY(-45%)}
.wavelo--triangles .wavelo__part:nth-child(2){transform:rotate(120deg) translateY(-45%);animation-delay:calc(var(--wavelo-duration) / -3)}
.wavelo--triangles .wavelo__part:nth-child(3){transform:rotate(240deg) translateY(-45%);animation-delay:calc(var(--wavelo-duration) * -2 / 3)}
`;
