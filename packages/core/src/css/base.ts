import { css as pulseFrames } from './keyframes/pulse.js';
import { css as dotOrbitFrames } from './keyframes/dot-orbit.js';
import { css as bounceDotFrames } from './keyframes/bounce-dot.js';
import { css as spinFrames } from './keyframes/spin.js';

export const baseCss = `
/* Registering these two tokens is what lets a determinate value animate: an
   unregistered custom property is an untyped token CSS cannot interpolate. The
   percentage matches the 35% the unregistered fallbacks use; the integer is the same
   value printed, so a design can count to it without JavaScript. Browsers without
   @property ignore both rules and fall back to those. */
@property --wavelo-progress{syntax:"<percentage>";inherits:true;initial-value:35%}
@property --wavelo-count{syntax:"<integer>";inherits:true;initial-value:0}
/* Every slice carries this base, so a page with two render kinds gets two copies and
   the second lands after the first kind's rules. At equal specificity it would win
   there and a design would lose the fill, display and duration its own rule set: a
   shape loader on a page that also draws a ring rendered hollow. :where() keeps these
   defaults at zero specificity, so a kind or design rule wins in any order. */
:where(.wavelo){display:inline-flex;position:relative;align-items:center;justify-content:center;box-sizing:border-box;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));color:var(--wavelo-color,#6366f1);background:var(--wavelo-background,transparent);transition:--wavelo-progress .2s ease;animation-duration:var(--wavelo-duration,1s);animation-direction:var(--wavelo-direction,normal);animation-play-state:var(--wavelo-play-state,running)}
:where(.wavelo__part){box-sizing:border-box;background:currentColor}
/* "inline" aligns an inline-level box with its text line; block and grid designs
   get an inline twin in their own slice. */
.wavelo-inline{vertical-align:middle}
.wavelo-host{display:contents}
.wavelo,.wavelo[data-wavelo-theme="light"]{--wavelo-skeleton-base:#e5e7eb;--wavelo-skeleton-highlight:#f9fafb}
/* A theme is the page's palette, not only the skeleton's: it sets the colour a
   design falls back to and the scrim an overlay draws, both of which an explicit
   "color" or "backgroundColor" still overrides. */
.wavelo[data-wavelo-theme="dark"]{--wavelo-skeleton-base:#374151;--wavelo-skeleton-highlight:#4b5563;--wavelo-color:#a5b4fc;--wavelo-scrim:#0f172a}
@media (prefers-color-scheme:dark){.wavelo[data-wavelo-theme="system"]{--wavelo-skeleton-base:#374151;--wavelo-skeleton-highlight:#4b5563;--wavelo-color:#a5b4fc;--wavelo-scrim:#0f172a}}
@media (prefers-reduced-motion:reduce){.wavelo:not([data-wavelo-motion="never"]),.wavelo:not([data-wavelo-motion="never"]) *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition:none!important}}
.wavelo[data-wavelo-motion="always"],.wavelo[data-wavelo-motion="always"] *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition:none!important}
${pulseFrames}${dotOrbitFrames}${bounceDotFrames}${spinFrames}`;
