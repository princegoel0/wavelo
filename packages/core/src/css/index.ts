import type { RenderKind } from '../types.js';
import { baseCss } from './base.js';
import { barsCss } from './kinds/bars.js';
import { dotsCss } from './kinds/dots.js';
import { orbitCss } from './kinds/orbit.js';
import { overlayCss } from './kinds/overlay.js';
import { progressCss } from './kinds/progress.js';
import { pulseCss } from './kinds/pulse.js';
import { ringCss } from './kinds/ring.js';
import { ringsCss } from './kinds/rings.js';
import { scrollCss } from './kinds/scroll.js';
import { shapeCss } from './kinds/shape.js';
import { skeletonCss } from './kinds/skeleton.js';
import { waveCss } from './kinds/wave.js';

export { baseCss };

/**
 * The stylesheet each render kind needs. A design ships `baseCss` plus exactly
 * one entry from this map, so importing one loader never carries another
 * design's rules.
 */
export const kindStyles: Record<RenderKind, string> = {
  ring: ringCss,
  rings: ringsCss,
  dots: dotsCss,
  bars: barsCss,
  wave: waveCss,
  orbit: orbitCss,
  shape: shapeCss,
  pulse: pulseCss,
  skeleton: skeletonCss,
  progress: progressCss,
  scroll: scrollCss,
  overlay: overlayCss
};

/**
 * Every kind, for callers that select a design at runtime. Keyframes used by
 * more than one kind live in `baseCss` rather than in the kinds that animate
 * with them, so each frame appears exactly once in this concatenation.
 */
export const allStyles = baseCss + Object.values(kindStyles).join('');

/** Stylesheet for one design: the shared base plus its own render kind. */
export function designStyles(kind: RenderKind): string {
  return baseCss + kindStyles[kind];
}
