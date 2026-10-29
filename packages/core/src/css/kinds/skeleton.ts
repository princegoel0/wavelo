import { css as shimmerFrames } from '../keyframes/shimmer.js';

export const skeletonCss = `
.wavelo--skeleton{display:block;width:var(--wavelo-width,var(--wavelo-size,2.5rem));height:var(--wavelo-height,var(--wavelo-size,2.5rem));border-radius:var(--wavelo-radius, .4rem);background:linear-gradient(90deg,var(--wavelo-skeleton-base),var(--wavelo-skeleton-highlight),var(--wavelo-skeleton-base));background-size:200% 100%;animation:wavelo-shimmer var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--skeleton-card,.wavelo--skeleton-table,.wavelo--skeleton-dashboard{display:grid;grid-template-columns:minmax(0,1fr);align-content:center;gap:6px;padding:8px;min-width:10rem;min-height:6rem;background:transparent;animation:none}
.wavelo--skeleton-card .wavelo__part,.wavelo--skeleton-table .wavelo__part,.wavelo--skeleton-dashboard .wavelo__part{display:block;width:100%;height:8px;border-radius:4px;background:linear-gradient(90deg,var(--wavelo-skeleton-base),var(--wavelo-skeleton-highlight),var(--wavelo-skeleton-base));background-size:200% 100%;animation:wavelo-shimmer var(--wavelo-duration,1s) linear infinite var(--wavelo-direction,normal) var(--wavelo-play-state,running)}
.wavelo--skeleton-card .wavelo__part:first-child{width:48px;height:48px;border-radius:50%}
.wavelo--skeleton-card .wavelo__part:nth-child(2){width:85%}
.wavelo--skeleton-card .wavelo__part:nth-child(3){width:65%}
.wavelo--skeleton-table .wavelo__part:nth-child(odd){width:92%}
.wavelo--skeleton-table .wavelo__part:nth-child(even){width:70%}
.wavelo--skeleton-dashboard{grid-template-columns:repeat(2,minmax(0,1fr))}
.wavelo--skeleton-dashboard .wavelo__part{height:20px}
.wavelo--skeleton-dashboard .wavelo__part:nth-child(1){grid-column:span 2;height:10px}
.wavelo--skeleton-avatar{border-radius:50%}
.wavelo--skeleton-line{min-width:10rem;max-height:.75rem;border-radius:.2rem}
.wavelo--image-placeholder{min-width:10rem;min-height:7.5rem;background:linear-gradient(110deg,var(--wavelo-skeleton-base) 30%,var(--wavelo-skeleton-highlight) 45%,var(--wavelo-skeleton-base) 60%);background-size:250% 100%}
${shimmerFrames}`;
