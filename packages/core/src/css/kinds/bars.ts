import { css as equalizerFrames } from '../keyframes/equalizer.js';
import { css as bounceBarFrames } from '../keyframes/bounce-bar.js';
import { css as pulseBarFrames } from '../keyframes/pulse-bar.js';
import { css as fadeBarFrames } from '../keyframes/fade-bar.js';
import { css as growBarFrames } from '../keyframes/grow-bar.js';
import { css as audioFrames } from '../keyframes/audio.js';
import { css as signalFrames } from '../keyframes/signal.js';
import { css as pianoFrames } from '../keyframes/piano.js';
import { css as fireFrames } from '../keyframes/fire.js';
import { css as spectrumFrames } from '../keyframes/spectrum.js';

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
/* Signal strength: four bars of increasing height filling in sequence, the way a
   radio reads up a connection. */
.wavelo--signal-bars .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-signal calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--signal-bars .wavelo__part:nth-child(1){height:40%}
.wavelo--signal-bars .wavelo__part:nth-child(2){height:60%}
.wavelo--signal-bars .wavelo__part:nth-child(3){height:80%}
.wavelo--signal-bars .wavelo__part:nth-child(4){height:100%}
.wavelo--signal-bars .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.4)}
.wavelo--signal-bars .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.8)}
.wavelo--signal-bars .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
/* Piano keys: the same fall-and-rise at four different points in the cycle, so the
   bars do not sweep as a wave but land one after another. */
.wavelo--piano-keys .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-piano calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--piano-keys .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.28)}
.wavelo--piano-keys .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.84)}
.wavelo--piano-keys .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -1.12)}
.wavelo--piano-keys .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.56)}
/* A fire: each bar rises, stretches and burns out at the top, on offsets uneven enough
   that the row never beats together. */
.wavelo--fire-rise .wavelo__part{height:100%;transform-origin:bottom;animation:wavelo-fire calc(var(--wavelo-duration,1s) * 1.2) var(--wavelo-ease,ease-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--fire-rise .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.17)}
.wavelo--fire-rise .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.43)}
.wavelo--fire-rise .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.61)}
.wavelo--fire-rise .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.89)}
/* A spectrum analyser: eight bars running the same uneven ladder of heights a step out
   of phase with each other, which reads as signal rather than a wave. */
.wavelo--spectrum{gap:var(--wavelo-gap,2px)}
.wavelo--spectrum .wavelo__part{width:calc(var(--wavelo-size,2.5rem) / 14);height:100%;transform-origin:bottom;animation:wavelo-spectrum calc(var(--wavelo-duration,1s) * 1.8) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--spectrum .wavelo__part:nth-child(2){animation-delay:calc(var(--wavelo-duration,1s) * -.2)}
.wavelo--spectrum .wavelo__part:nth-child(3){animation-delay:calc(var(--wavelo-duration,1s) * -.45)}
.wavelo--spectrum .wavelo__part:nth-child(4){animation-delay:calc(var(--wavelo-duration,1s) * -.7)}
.wavelo--spectrum .wavelo__part:nth-child(5){animation-delay:calc(var(--wavelo-duration,1s) * -.95)}
.wavelo--spectrum .wavelo__part:nth-child(6){animation-delay:calc(var(--wavelo-duration,1s) * -1.2)}
.wavelo--spectrum .wavelo__part:nth-child(7){animation-delay:calc(var(--wavelo-duration,1s) * -1.45)}
.wavelo--spectrum .wavelo__part:nth-child(8){animation-delay:calc(var(--wavelo-duration,1s) * -1.65)}
${equalizerFrames}${bounceBarFrames}${pulseBarFrames}${fadeBarFrames}${growBarFrames}${audioFrames}${signalFrames}${pianoFrames}${fireFrames}${spectrumFrames}`;
