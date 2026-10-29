import { css as equalizerFrames } from '../keyframes/equalizer.js';
import { css as bounceBarFrames } from '../keyframes/bounce-bar.js';
import { css as pulseBarFrames } from '../keyframes/pulse-bar.js';
import { css as fadeBarFrames } from '../keyframes/fade-bar.js';
import { css as growBarFrames } from '../keyframes/grow-bar.js';
import { css as audioFrames } from '../keyframes/audio.js';

export const barsCss = `
.wavelo--bars{align-items:flex-end;gap:var(--wavelo-gap,3px)}
.wavelo--bars .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 8);height:70%;border-radius:var(--wavelo-radius,2px)}
.wavelo--bars .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) / -5)}
.wavelo--bars .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 5)}
.wavelo--bars .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -3 / 5)}
.wavelo--bars .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -4 / 5)}
.wavelo--equalizer .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-equalizer var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--bouncing-bars .wavelo__part{animation:wavelo-bounce-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--vertical-pulse-bars .wavelo__part{animation:wavelo-pulse-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fading-bars .wavelo__part{animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--growing-bars .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(odd){height:100%;transform-origin:bottom;animation:wavelo-grow-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--alternating-bars .wavelo__part:nth-child(even){animation:wavelo-fade-bar var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--gradient-bars .wavelo__part{height:100%;transform-origin:bottom;background:linear-gradient(currentColor,var(--wavelo-secondary-color,#a5b4fc));animation:wavelo-equalizer var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--audio-waveform{align-items:center;gap:var(--wavelo-gap,2px)}
.wavelo--audio-waveform .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 14);height:80%;border-radius:var(--wavelo-radius,1px);transform-origin:50% 50%;animation:wavelo-audio var(--wavelo-duration,1s) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--audio-waveform .wavelo__part:nth-child(2),.wavelo--audio-waveform .wavelo__part:nth-child(7){animation-delay:calc(var(--wavelo-duration,1s) / -6)}
.wavelo--audio-waveform .wavelo__part:nth-child(3),.wavelo--audio-waveform .wavelo__part:nth-child(6){animation-delay:calc(var(--wavelo-duration,1s) / -3)}
.wavelo--audio-waveform .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) / -2)}
.wavelo--audio-waveform .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -2 / 3)}
${equalizerFrames}${bounceBarFrames}${pulseBarFrames}${fadeBarFrames}${growBarFrames}${audioFrames}`;
