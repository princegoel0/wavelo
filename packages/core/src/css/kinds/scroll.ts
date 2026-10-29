import { css as scrollFillFrames } from '../keyframes/scroll-fill.js';

/**
 * Reading progress with no JavaScript: the fill is a scroll-driven animation, so
 * the browser maps the document's scroll position onto the bar.
 *
 * The timeline is `scroll(root block)`, not `scroll(nearest block)`. A `nearest`
 * timeline binds to the closest ancestor scroll container, and `overflow:hidden`
 * creates one: measured in Chromium, a bar inside such a wrapper got an inactive
 * timeline (`currentTime` null) and never filled, however far the page scrolled.
 * Callers who want an inner container to drive the bar override
 * `animation-timeline` themselves.
 *
 * Where scroll timelines do not exist the same keyframes run on the document
 * clock as a repeating sweep, so the component shows activity instead of an
 * empty track.
 */
export const scrollCss = `
.wavelo--scroll{display:block;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));min-width:6rem;max-height:.5rem;border-radius:999px;background:color-mix(in srgb,currentColor 14%,transparent)}
.wavelo--scroll .wavelo__part{display:block;position:relative;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,color-mix(in srgb,currentColor 45%,transparent),currentColor);animation:wavelo-scroll-fill var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--progress-scroll .wavelo__part:after{content:"";position:absolute;left:100%;top:50%;height:220%;aspect-ratio:1;border-radius:50%;background:currentColor;transform:translate(-50%,-50%)}
@supports (animation-timeline:scroll()){
.wavelo--scroll .wavelo__part{animation-iteration-count:1;animation-fill-mode:both;animation-timeline:scroll(root block)}
}
${scrollFillFrames}`;
