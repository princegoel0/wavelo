export const waveCss = `
.wavelo--wave{gap:3px}
.wavelo--wave .wavelo__part{width:calc(var(--wavelo-size) / 8);height:70%;border-radius:2px;animation:wavelo-wave var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--moving-stripe,.wavelo--traveling-highlight{background:repeating-linear-gradient(45deg,currentColor 0 8px,transparent 8px 16px);animation:wavelo-stripe var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--traveling-highlight{background:linear-gradient(90deg,transparent,currentColor,transparent);animation:wavelo-highlight var(--wavelo-duration) linear infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--oscillating-line{height:var(--wavelo-stroke);background:currentColor;animation:wavelo-wave var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--vertical-dots{flex-direction:column}
.wavelo--vertical-dots .wavelo__part{animation:wavelo-bounce-dot var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--waveform .wavelo__part{animation:wavelo-waveform var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--horizontal-pulse-bars .wavelo__part{animation:wavelo-horizontal-pulse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--multi-wave .wavelo__part:nth-child(odd){animation:wavelo-waveform var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--multi-wave .wavelo__part:nth-child(even){animation:wavelo-waveform-reverse var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--helix .wavelo__part{width:12%;height:12%;border-radius:50%;animation:wavelo-helix var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
.wavelo--helix{display:block;background:transparent}
.wavelo--helix .wavelo__part{position:absolute;left:44%;top:45%;width:12%;height:12%;border-radius:50%}
.wavelo--helix .wavelo__part:nth-child(1){transform:translate(-28px,-24px)}
.wavelo--helix .wavelo__part:nth-child(2){transform:translate(28px,-14px)}
.wavelo--helix .wavelo__part:nth-child(3){transform:translate(-28px,-4px)}
.wavelo--helix .wavelo__part:nth-child(4){transform:translate(28px,6px)}
.wavelo--helix .wavelo__part:nth-child(5){transform:translate(-28px,16px)}
.wavelo--helix .wavelo__part:nth-child(6){transform:translate(28px,26px)}
.wavelo--helix:before,.wavelo--helix:after{content:"";position:absolute;left:25%;top:46%;width:50%;height:8%;border-top:var(--wavelo-stroke) solid currentColor;border-radius:50%;animation:wavelo-helix-line var(--wavelo-duration) ease-in-out infinite var(--wavelo-direction) var(--wavelo-play-state)}
`;
