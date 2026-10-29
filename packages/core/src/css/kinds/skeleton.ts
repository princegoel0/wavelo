import { css as shimmerFrames } from '../keyframes/shimmer.js';
import { css as responseShimmerFrames } from '../keyframes/response-shimmer.js';
import { css as chatTypingFrames } from '../keyframes/chat-typing.js';

export const skeletonCss = `
.wavelo--skeleton{display:block;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));border-radius:var(--wavelo-radius,.4rem);background:linear-gradient(90deg,var(--wavelo-skeleton-base),var(--wavelo-skeleton-highlight),var(--wavelo-skeleton-base));background-size:200% 100%;animation:wavelo-shimmer var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--skeleton-card,.wavelo--skeleton-table,.wavelo--skeleton-dashboard{display:grid;grid-template-columns:minmax(0,1fr);align-content:center;gap:var(--wavelo-gap,6px);padding:8px;width:var(--wavelo-width,var(--wavelo-size,10rem));height:var(--wavelo-height,var(--wavelo-size,6rem));background:transparent;animation:none}
.wavelo--skeleton-card .wavelo__part,.wavelo--skeleton-table .wavelo__part,.wavelo--skeleton-dashboard .wavelo__part{display:block;width:100%;height:8px;border-radius:var(--wavelo-radius,4px);background:linear-gradient(90deg,var(--wavelo-skeleton-base),var(--wavelo-skeleton-highlight),var(--wavelo-skeleton-base));background-size:200% 100%;animation:wavelo-shimmer var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--skeleton-card .wavelo__part:first-child{width:48px;height:48px;border-radius:50%}
.wavelo--skeleton-card .wavelo__part:nth-child(2){width:85%}
.wavelo--skeleton-card .wavelo__part:nth-child(3){width:65%}
.wavelo--skeleton-table .wavelo__part:nth-child(odd){width:92%}
.wavelo--skeleton-table .wavelo__part:nth-child(even){width:70%}
.wavelo--skeleton-dashboard{grid-template-columns:repeat(2,minmax(0,1fr))}
.wavelo--skeleton-dashboard .wavelo__part{height:20px}
.wavelo--skeleton-dashboard .wavelo__part:nth-child(1){grid-column:span 2;height:10px}
.wavelo--skeleton-avatar{border-radius:50%}
.wavelo--skeleton-line{width:var(--wavelo-width,var(--wavelo-size,10rem));height:var(--wavelo-height,.75rem);border-radius:var(--wavelo-radius,.2rem)}
/* "inline" puts a placeholder on the text line: the box becomes inline-level, and a
   line defaults to text metrics rather than a paragraph block. */
.wavelo--skeleton.wavelo-inline{display:inline-block}
.wavelo--skeleton-card.wavelo-inline,.wavelo--skeleton-table.wavelo-inline,.wavelo--skeleton-dashboard.wavelo-inline{display:inline-grid}
.wavelo--skeleton-line.wavelo-inline{width:var(--wavelo-width,var(--wavelo-size,6em));height:var(--wavelo-height,1em)}
.wavelo--image-placeholder{width:var(--wavelo-width,var(--wavelo-size,10rem));height:var(--wavelo-height,var(--wavelo-size,7.5rem));background:linear-gradient(110deg,var(--wavelo-skeleton-base) 30%,var(--wavelo-skeleton-highlight) 45%,var(--wavelo-skeleton-base) 60%);background-size:250% 100%}
/* A counted line is a stack of tracks rather than one painted box, so the element
   stops painting and each track shimmers on its own; the last one is short, because
   that is how a block of text ends. */
.wavelo--skeleton.wavelo-stacked{display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:min-content;gap:var(--wavelo-gap,.5rem);height:auto;background:transparent;animation:none}
.wavelo--skeleton.wavelo-stacked .wavelo__part{display:block;width:100%;height:var(--wavelo-height,.75rem);border-radius:var(--wavelo-radius,.2rem);background:linear-gradient(90deg,var(--wavelo-skeleton-base),var(--wavelo-skeleton-highlight),var(--wavelo-skeleton-base));background-size:200% 100%;animation:wavelo-shimmer var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--skeleton-line.wavelo-stacked .wavelo__part:last-child{width:65%}
.wavelo--skeleton.wavelo-stacked.wavelo-inline{display:inline-grid}
/* A response block: one bright sweep crossing a tall rounded panel, the shape a
   streaming answer actually occupies. */
.wavelo--ai-shimmer{width:var(--wavelo-width,var(--wavelo-size,12rem));height:var(--wavelo-height,var(--wavelo-size,3.5rem));border-radius:var(--wavelo-radius,.75rem);background:linear-gradient(90deg,var(--wavelo-skeleton-base) 0 38%,var(--wavelo-skeleton-highlight) 50%,var(--wavelo-skeleton-base) 62% 100%);background-size:220% 100%;animation:wavelo-response-shimmer calc(var(--wavelo-duration,1s) * 1.6) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--ai-shimmer.wavelo-inline{display:inline-block}
/* Composite placeholders: the element stops painting and becomes the grid of tracks
   the screen it stands in for is made of. Each one keeps the shimmer on its tracks. */
.wavelo--skeleton-inbox,.wavelo--skeleton-chat,.wavelo--skeleton-code,.wavelo--skeleton-metric{display:grid;align-content:center;padding:8px;width:var(--wavelo-width,var(--wavelo-size,14rem));height:auto;background:transparent;animation:none;gap:var(--wavelo-gap,8px)}
.wavelo--skeleton-inbox .wavelo__part,.wavelo--skeleton-chat .wavelo__part,.wavelo--skeleton-code .wavelo__part,.wavelo--skeleton-metric .wavelo__part{height:10px;border-radius:var(--wavelo-radius,4px);background:linear-gradient(90deg,var(--wavelo-skeleton-base),var(--wavelo-skeleton-highlight),var(--wavelo-skeleton-base));background-size:200% 100%;animation:wavelo-shimmer var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--skeleton-inbox.wavelo-inline,.wavelo--skeleton-chat.wavelo-inline,.wavelo--skeleton-code.wavelo-inline,.wavelo--skeleton-metric.wavelo-inline{display:inline-grid}
/* An inbox row is an avatar and the start of its subject, repeated. */
.wavelo--skeleton-inbox{grid-template-columns:44px minmax(0,1fr)}
.wavelo--skeleton-inbox .wavelo__part:nth-child(odd){width:100%;height:44px;border-radius:50%}
.wavelo--skeleton-inbox .wavelo__part:nth-child(even){width:78%;align-self:center}
.wavelo--skeleton-inbox .wavelo__part:nth-child(4n){width:52%}
/* A thread: answers sit left, questions sit right, and the newest bubble lifts while
   the reply is still being written. */
.wavelo--skeleton-chat{grid-template-columns:minmax(0,1fr);gap:var(--wavelo-gap,10px)}
.wavelo--skeleton-chat .wavelo__part{width:62%;height:28px;border-radius:14px;justify-self:start}
.wavelo--skeleton-chat .wavelo__part:nth-child(odd){border-bottom-right-radius:var(--wavelo-radius,4px)}
.wavelo--skeleton-chat .wavelo__part:nth-child(even){width:76%;justify-self:end;border-bottom-left-radius:var(--wavelo-radius,4px)}
.wavelo--skeleton-chat .wavelo__part:last-child{animation:wavelo-chat-typing calc(var(--wavelo-duration,1s) * 1.4) var(--wavelo-ease,ease-in-out) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
/* Code: a numbered gutter down the left, lines of uneven width, and a last line that
   ends short because a block of code ends mid-line. */
.wavelo--skeleton-code{grid-template-columns:minmax(0,1fr);position:relative}
.wavelo--skeleton-code:before{content:"";position:absolute;top:8px;bottom:8px;left:8px;width:22px;border-radius:var(--wavelo-radius,4px);background:var(--wavelo-skeleton-base)}
.wavelo--skeleton-code .wavelo__part{width:88%;margin-left:30px}
.wavelo--skeleton-code .wavelo__part:nth-child(3n){width:64%}
.wavelo--skeleton-code .wavelo__part:last-child{width:42%}
/* A metric card: the number, its label, then the trend chip. */
.wavelo--skeleton-metric{grid-template-columns:minmax(0,1fr);gap:var(--wavelo-gap,10px)}
.wavelo--skeleton-metric .wavelo__part:nth-child(1){width:56%;height:32px}
.wavelo--skeleton-metric .wavelo__part:nth-child(2){width:78%;height:12px}
.wavelo--skeleton-metric .wavelo__part:nth-child(3){width:26%;height:12px;border-radius:999px}
${shimmerFrames}${responseShimmerFrames}${chatTypingFrames}`;
