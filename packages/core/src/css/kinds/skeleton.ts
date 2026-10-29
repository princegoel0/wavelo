import { css as shimmerFrames } from '../keyframes/shimmer.js';

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
${shimmerFrames}`;
