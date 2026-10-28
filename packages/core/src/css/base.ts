import { css as pulseFrames } from './keyframes/pulse.js';
import { css as dotOrbitFrames } from './keyframes/dot-orbit.js';
import { css as bounceDotFrames } from './keyframes/bounce-dot.js';
import { css as spinFrames } from './keyframes/spin.js';

export const baseCss = `
.wavelo{display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;width:var(--wavelo-width);height:var(--wavelo-height);color:var(--wavelo-color,#6366f1);background:var(--wavelo-background,transparent);animation-duration:var(--wavelo-duration);animation-direction:var(--wavelo-direction);animation-play-state:var(--wavelo-play-state)}
.wavelo__part{box-sizing:border-box;background:currentColor}
.wavelo-host{display:contents}
.wavelo,.wavelo[data-wavelo-theme="light"]{--wavelo-skeleton-base:#e5e7eb;--wavelo-skeleton-highlight:#f9fafb}
.wavelo[data-wavelo-theme="dark"]{--wavelo-skeleton-base:#374151;--wavelo-skeleton-highlight:#4b5563}
@media (prefers-color-scheme:dark){.wavelo[data-wavelo-theme="system"]{--wavelo-skeleton-base:#374151;--wavelo-skeleton-highlight:#4b5563}}
@media (prefers-reduced-motion:reduce){.wavelo:not([data-wavelo-motion="never"]),.wavelo:not([data-wavelo-motion="never"]) *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition:none!important}}
.wavelo[data-wavelo-motion="always"],.wavelo[data-wavelo-motion="always"] *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition:none!important}
${pulseFrames}${dotOrbitFrames}${bounceDotFrames}${spinFrames}`;
