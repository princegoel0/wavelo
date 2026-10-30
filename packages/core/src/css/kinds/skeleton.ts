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
/* Specialized Skeletons: E-Commerce, Analytics & Dashboards, SaaS & Productivity */
.wavelo--skeleton-product-card,.wavelo--skeleton-product-page,.wavelo--skeleton-cart,.wavelo--skeleton-review,.wavelo--skeleton-chart-bar,.wavelo--skeleton-chart-line,.wavelo--skeleton-chart-donut,.wavelo--skeleton-data-table,.wavelo--skeleton-kanban,.wavelo--skeleton-timeline,.wavelo--skeleton-calendar{background:transparent;animation:none;padding:8px}
.wavelo--skeleton-product-card .wavelo__part,.wavelo--skeleton-product-page .wavelo__part,.wavelo--skeleton-cart .wavelo__part,.wavelo--skeleton-review .wavelo__part,.wavelo--skeleton-chart-bar .wavelo__part,.wavelo--skeleton-chart-line .wavelo__part,.wavelo--skeleton-chart-donut .wavelo__part,.wavelo--skeleton-data-table .wavelo__part,.wavelo--skeleton-kanban .wavelo__part,.wavelo--skeleton-timeline .wavelo__part,.wavelo--skeleton-calendar .wavelo__part{display:block;border-radius:var(--wavelo-radius,4px);background:linear-gradient(90deg,var(--wavelo-skeleton-base),var(--wavelo-skeleton-highlight),var(--wavelo-skeleton-base));background-size:200% 100%;animation:wavelo-shimmer var(--wavelo-duration,1s) var(--wavelo-ease,linear) infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--skeleton-product-card.wavelo-inline,.wavelo--skeleton-product-page.wavelo-inline,.wavelo--skeleton-cart.wavelo-inline,.wavelo--skeleton-review.wavelo-inline,.wavelo--skeleton-chart-line.wavelo-inline,.wavelo--skeleton-chart-donut.wavelo-inline,.wavelo--skeleton-data-table.wavelo-inline,.wavelo--skeleton-kanban.wavelo-inline,.wavelo--skeleton-timeline.wavelo-inline,.wavelo--skeleton-calendar.wavelo-inline{display:inline-grid}
.wavelo--skeleton-chart-bar.wavelo-inline{display:inline-flex}
.wavelo--skeleton-product-card{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--wavelo-gap,6px);width:var(--wavelo-width,var(--wavelo-size,10rem));height:auto}
.wavelo--skeleton-product-card .wavelo__part:nth-child(1){width:100%;height:64px;border-radius:var(--wavelo-radius,6px)}
.wavelo--skeleton-product-card .wavelo__part:nth-child(2){width:88%;height:10px}
.wavelo--skeleton-product-card .wavelo__part:nth-child(3){width:45%;height:10px}
.wavelo--skeleton-product-card .wavelo__part:nth-child(4){width:100%;height:22px;border-radius:var(--wavelo-radius,4px);margin-top:2px}
.wavelo--skeleton-product-page{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:var(--wavelo-gap,8px);width:var(--wavelo-width,var(--wavelo-size,16rem));height:auto}
.wavelo--skeleton-product-page .wavelo__part:nth-child(1){grid-row:span 4;width:100%;height:100%;min-height:80px;border-radius:var(--wavelo-radius,6px)}
.wavelo--skeleton-product-page .wavelo__part:nth-child(2){width:50%;height:8px}
.wavelo--skeleton-product-page .wavelo__part:nth-child(3){width:92%;height:14px}
.wavelo--skeleton-product-page .wavelo__part:nth-child(4){width:60%;height:10px}
.wavelo--skeleton-product-page .wavelo__part:nth-child(5){width:100%;height:24px;border-radius:var(--wavelo-radius,4px)}
.wavelo--skeleton-cart{display:grid;grid-template-columns:44px minmax(0,1fr) 36px;gap:var(--wavelo-gap,6px) 8px;align-items:center;width:var(--wavelo-width,var(--wavelo-size,14rem));height:auto}
.wavelo--skeleton-cart .wavelo__part:nth-child(1){grid-row:span 2;width:44px;height:44px;border-radius:var(--wavelo-radius,4px)}
.wavelo--skeleton-cart .wavelo__part:nth-child(2){grid-column:2;width:82%;height:10px}
.wavelo--skeleton-cart .wavelo__part:nth-child(3){grid-column:2;width:48%;height:14px;border-radius:999px}
.wavelo--skeleton-cart .wavelo__part:nth-child(4){grid-row:span 2;grid-column:3;width:100%;height:12px}
.wavelo--skeleton-review{display:grid;grid-template-columns:36px minmax(0,1fr);gap:var(--wavelo-gap,6px) 8px;align-items:center;width:var(--wavelo-width,var(--wavelo-size,14rem));height:auto}
.wavelo--skeleton-review .wavelo__part:nth-child(1){width:36px;height:36px;border-radius:50%}
.wavelo--skeleton-review .wavelo__part:nth-child(2){width:65%;height:10px}
.wavelo--skeleton-review .wavelo__part:nth-child(3){grid-column:span 2;width:100%;height:9px}
.wavelo--skeleton-review .wavelo__part:nth-child(4){grid-column:span 2;width:72%;height:9px}
.wavelo--skeleton-chart-bar{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--wavelo-gap,6px);width:var(--wavelo-width,var(--wavelo-size,11rem));height:var(--wavelo-height,var(--wavelo-size,5rem))}
.wavelo--skeleton-chart-bar .wavelo__part{flex:1;border-radius:var(--wavelo-radius,3px) var(--wavelo-radius,3px) 0 0}
.wavelo--skeleton-chart-bar .wavelo__part:nth-child(1){height:40%}
.wavelo--skeleton-chart-bar .wavelo__part:nth-child(2){height:75%}
.wavelo--skeleton-chart-bar .wavelo__part:nth-child(3){height:30%}
.wavelo--skeleton-chart-bar .wavelo__part:nth-child(4){height:90%}
.wavelo--skeleton-chart-bar .wavelo__part:nth-child(5){height:55%}
.wavelo--skeleton-chart-line{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:end;gap:var(--wavelo-gap,6px);width:var(--wavelo-width,var(--wavelo-size,11rem));height:var(--wavelo-height,var(--wavelo-size,5rem));position:relative}
.wavelo--skeleton-chart-line:before{content:"";position:absolute;left:8px;right:8px;bottom:8px;height:1px;background:var(--wavelo-skeleton-base)}
.wavelo--skeleton-chart-line .wavelo__part{height:4px;border-radius:2px;transform-origin:bottom left}
.wavelo--skeleton-chart-line .wavelo__part:nth-child(1){margin-bottom:12px;transform:rotate(-18deg)}
.wavelo--skeleton-chart-line .wavelo__part:nth-child(2){margin-bottom:28px;transform:rotate(12deg)}
.wavelo--skeleton-chart-line .wavelo__part:nth-child(3){margin-bottom:18px;transform:rotate(-22deg)}
.wavelo--skeleton-chart-line .wavelo__part:nth-child(4){margin-bottom:34px;transform:rotate(8deg)}
.wavelo--skeleton-chart-donut{display:grid;grid-template-columns:52px minmax(0,1fr);align-items:center;gap:var(--wavelo-gap,10px);width:var(--wavelo-width,var(--wavelo-size,11rem));height:var(--wavelo-height,var(--wavelo-size,4.5rem))}
.wavelo--skeleton-chart-donut .wavelo__part:nth-child(1){width:52px;height:52px;border-radius:50%;-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 calc(100% - 8px));mask:radial-gradient(farthest-side,transparent calc(100% - 9px),#000 calc(100% - 8px))}
.wavelo--skeleton-chart-donut .wavelo__part:nth-child(2){width:85%;height:10px}
.wavelo--skeleton-chart-donut .wavelo__part:nth-child(3){width:60%;height:10px}
.wavelo--skeleton-data-table{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--wavelo-gap,6px);width:var(--wavelo-width,var(--wavelo-size,14rem));height:auto}
.wavelo--skeleton-data-table .wavelo__part:nth-child(1){width:100%;height:14px;border-radius:var(--wavelo-radius,4px)}
.wavelo--skeleton-data-table .wavelo__part:nth-child(2){width:94%;height:8px}
.wavelo--skeleton-data-table .wavelo__part:nth-child(3){width:78%;height:8px}
.wavelo--skeleton-data-table .wavelo__part:nth-child(4){width:88%;height:8px}
.wavelo--skeleton-data-table .wavelo__part:nth-child(5){width:82%;height:8px}
.wavelo--skeleton-data-table .wavelo__part:nth-child(6){width:36%;height:10px;justify-self:end;border-radius:999px}
.wavelo--skeleton-kanban{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--wavelo-gap,6px);width:var(--wavelo-width,var(--wavelo-size,14rem));height:auto}
.wavelo--skeleton-kanban .wavelo__part:nth-child(1){height:32px}
.wavelo--skeleton-kanban .wavelo__part:nth-child(2){height:22px}
.wavelo--skeleton-kanban .wavelo__part:nth-child(3){height:44px}
.wavelo--skeleton-kanban .wavelo__part:nth-child(4){height:26px}
.wavelo--skeleton-kanban .wavelo__part:nth-child(5){height:36px}
.wavelo--skeleton-kanban .wavelo__part:nth-child(6){height:18px}
.wavelo--skeleton-timeline{display:grid;grid-template-columns:14px minmax(0,1fr);gap:var(--wavelo-gap,8px) 10px;align-items:center;width:var(--wavelo-width,var(--wavelo-size,12rem));position:relative}
.wavelo--skeleton-timeline:before{content:"";position:absolute;top:10px;bottom:10px;left:14px;width:2px;background:var(--wavelo-skeleton-base)}
.wavelo--skeleton-timeline .wavelo__part:nth-child(odd){width:14px;height:14px;border-radius:50%}
.wavelo--skeleton-timeline .wavelo__part:nth-child(even){width:84%;height:11px}
.wavelo--skeleton-timeline .wavelo__part:nth-child(4){width:62%}
.wavelo--skeleton-calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:var(--wavelo-gap,4px);width:var(--wavelo-width,var(--wavelo-size,13rem));height:auto}
.wavelo--skeleton-calendar .wavelo__part{height:24px;border-radius:var(--wavelo-radius,3px)}
.wavelo--skeleton-calendar .wavelo__part:nth-child(3){border-radius:50%}
${shimmerFrames}${responseShimmerFrames}${chatTypingFrames}`;
