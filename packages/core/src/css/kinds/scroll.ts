import { css as scrollFillFrames } from '../keyframes/scroll-fill.js';
import { css as viewFillFrames } from '../keyframes/view-fill.js';
import { css as chapterFillFrames } from '../keyframes/chapter-fill.js';

/**
 * Reading progress with no JavaScript: the fill is a scroll-driven animation, so
 * the browser maps a scroll or view position onto the bar. Four designs live here -
 * `progress-scroll` follows the document, `progress-view` follows the element,
 * `scroll-horizontal` follows horizontal document scroll, and `scroll-chapters`
 * fills three reading stages in sequence.
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
.wavelo--scroll{display:block;width:var(--wavelo-width,100%);height:var(--wavelo-height,.5rem);border-radius:var(--wavelo-radius,999px);background:color-mix(in srgb,currentColor 14%,transparent)}
.wavelo--scroll.wavelo-inline{display:inline-block}
.wavelo--scroll .wavelo__part{display:block;position:relative;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,color-mix(in srgb,currentColor 45%,transparent),currentColor);animation:wavelo-scroll-fill var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--progress-scroll .wavelo__part:after{content:"";position:absolute;left:100%;top:50%;height:220%;aspect-ratio:1;border-radius:50%;background:currentColor;transform:translate(-50%,-50%)}
@supports (animation-timeline:scroll()){
.wavelo--scroll .wavelo__part{animation-iteration-count:1;animation-fill-mode:both;animation-timeline:scroll(root block)}
}
/* "progress-view" follows the element it sits on rather than the document: a view
   timeline takes the animated element as its subject, and the fill is the loader's
   own box, so this bar reads its in-view progress. To make a different element the
   subject, declare "view-timeline: --name block" on it and set
   "--wavelo-timeline: --name" here. The fill is a scale, not a width, because a
   bar that re-lays-out the page on every frame of a scroll is the one thing a
   reading indicator must not do. Without view timelines the same frames run on the
   document clock, so the bar shows activity instead of an empty track. */
.wavelo--progress-view .wavelo__part{width:100%;transform-origin:left;animation:wavelo-view-fill var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
@supports (animation-timeline:view()){
.wavelo--progress-view .wavelo__part{animation-iteration-count:1;animation-fill-mode:both;animation-timeline:var(--wavelo-timeline,view(block))}
}
.wavelo--scroll-horizontal .wavelo__part{width:100%;transform-origin:left;animation:wavelo-view-fill var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
@supports (animation-timeline:scroll()){
.wavelo--scroll-horizontal .wavelo__part{animation-iteration-count:1;animation-fill-mode:both;animation-timeline:scroll(root inline)}
}
.wavelo--scroll-chapters{display:block;white-space:nowrap;background:transparent;border-radius:0}
.wavelo--scroll-chapters .wavelo__part{position:relative;display:inline-block;vertical-align:top;width:calc((100% - var(--wavelo-gap,6px) * 2) / 3);height:100%;margin-right:var(--wavelo-gap,6px);overflow:hidden;border-radius:var(--wavelo-radius,2px);background:color-mix(in srgb,currentColor 16%,transparent);animation:none}
.wavelo--scroll-chapters .wavelo__part:nth-child(3){margin-right:0}
.wavelo--scroll-chapters .wavelo__part i{position:absolute;inset:0;background:currentColor;opacity:0;animation:wavelo-chapter-fill var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
@supports (animation-timeline:scroll()){
.wavelo--scroll-chapters .wavelo__part i{animation-iteration-count:1;animation-fill-mode:both;animation-timeline:scroll(root block)}
.wavelo--scroll-chapters .wavelo__part:nth-child(1) i{animation-range:0% 33.333%}
.wavelo--scroll-chapters .wavelo__part:nth-child(2) i{animation-range:33.333% 66.666%}
.wavelo--scroll-chapters .wavelo__part:nth-child(3) i{animation-range:66.666% 100%}
}
${scrollFillFrames}${viewFillFrames}${chapterFillFrames}`;
