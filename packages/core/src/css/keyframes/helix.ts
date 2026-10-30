/* One keyframe, two strands: the far nodes run the same path half a cycle behind their
 * pair, so they are at the opposite edge whenever the near nodes reach theirs, and both
 * are at the centre — crossing — a quarter of a cycle either side of that. The swell at
 * the centre is the depth cue: a node is nearest the viewer as it passes in front of the
 * other strand, and smallest at the extremes where it curves away behind. */
export const css = `@keyframes wavelo-helix{0%,100%{transform:translateY(-50%) translateX(calc(-.32*var(--wavelo-width,var(--wavelo-size,2.5rem)))) scale(.8)}25%,75%{transform:translateY(-50%) scale(1.1)}50%{transform:translateY(-50%) translateX(calc(.32*var(--wavelo-width,var(--wavelo-size,2.5rem)))) scale(.8)}}`;
