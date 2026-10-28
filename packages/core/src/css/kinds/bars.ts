export const barsCss = `
.wavelo--bars{align-items:flex-end;gap:3px}
.wavelo--bars .wavelo__part{width:calc(var(--wavelo-size) / 8);height:70%;border-radius:2px;animation:wavelo-bars var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--bars .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration) / -5)}
.wavelo--bars .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration) * -2 / 5)}
.wavelo--bars .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration) * -3 / 5)}
.wavelo--bars .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration) * -4 / 5)}
.wavelo--equalizer .wavelo__part{animation:wavelo-equalizer var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--bouncing-bars .wavelo__part{animation:wavelo-bounce-bar var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--vertical-pulse-bars .wavelo__part{animation:wavelo-pulse-bar var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--fading-bars .wavelo__part{animation:wavelo-fade-bar var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--growing-bars .wavelo__part{animation:wavelo-grow-bar var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--alternating-bars .wavelo__part:nth-child(odd){animation:wavelo-grow-bar var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--alternating-bars .wavelo__part:nth-child(even){animation:wavelo-fade-bar var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
`;
