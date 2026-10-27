import { LoaderDefinition } from './types.js';

type Entry = [string, string, LoaderDefinition['category'], LoaderDefinition['kind'], string];

const entries: Entry[] = [
  ['circular', 'Circular border', 'spinner', 'ring', 'Classic circular border spinner'],
  ['ring', 'Ring', 'spinner', 'ring', 'Open ring spinner'],
  ['dual-ring', 'Dual ring', 'spinner', 'rings', 'Nested dual-ring rotation'],
  ['arc', 'Rotating arc', 'spinner', 'ring', 'Single rotating arc'],
  ['multi-arc', 'Multiple arcs', 'spinner', 'rings', 'Layered rotating arcs'],
  ['dotted-circle', 'Dotted circle', 'spinner', 'dots', 'Circular dotted spinner'],
  ['segmented-ring', 'Segmented ring', 'spinner', 'rings', 'Segmented circular indicator'],
  ['half-circle', 'Half circle', 'spinner', 'ring', 'Half-circle sweep'],
  ['ellipse', 'Elliptical spinner', 'spinner', 'ring', 'Elliptical rotation'],
  ['rotating-square', 'Rotating square', 'spinner', 'shape', 'Rotating square'],
  ['rotating-diamond', 'Rotating diamond', 'spinner', 'shape', 'Rotating diamond'],
  ['orbiting-dots', 'Orbiting dots', 'spinner', 'orbit', 'Dots orbiting a center'],
  ['orbiting-circles', 'Orbiting circles', 'spinner', 'orbit', 'Circles orbiting a center'],
  ['gradient-ring', 'Gradient ring', 'spinner', 'ring', 'Gradient ring sweep'],
  ['thin-line', 'Thin line', 'spinner', 'ring', 'Minimal thin line'],
  ['thick-stroke', 'Thick stroke', 'spinner', 'ring', 'Bold stroke spinner'],
  ['monochrome', 'Monochrome', 'spinner', 'ring', 'Minimal monochrome spinner'],
  ['svg-star', 'SVG star', 'spinner', 'shape', 'Star-shaped SVG spinner'],
  ['three-dots', 'Three dots', 'dots', 'dots', 'Three-dot sequence'],
  ['four-dots', 'Four dots', 'dots', 'dots', 'Four-dot sequence'],
  ['five-dots', 'Five dots', 'dots', 'dots', 'Five-dot sequence'],
  ['bouncing-dots', 'Bouncing dots', 'dots', 'dots', 'Bouncing dot rhythm'],
  ['pulsing-dots', 'Pulsing dots', 'dots', 'pulse', 'Sequential pulse'],
  ['fading-dots', 'Fading dots', 'dots', 'dots', 'Fading dot sequence'],
  ['scaling-dots', 'Scaling dots', 'dots', 'pulse', 'Scaling dots'],
  ['rotating-dots', 'Rotating dots', 'dots', 'orbit', 'Rotating dots'],
  ['dot-wave', 'Dot wave', 'dots', 'wave', 'Wave of dots'],
  ['dot-matrix', 'Dot matrix', 'dots', 'dots', 'Matrix pulse'],
  ['grid-pulse', 'Grid pulse', 'dots', 'pulse', 'Grid pulse'],
  ['alternating-dots', 'Alternating dots', 'dots', 'dots', 'Alternating dot groups'],
  ['expanding-dot', 'Expanding dot', 'dots', 'pulse', 'Expanding dot'],
  ['ripple-dot', 'Ripple dot', 'dots', 'rings', 'Ripple from a dot'],
  ['staggered-dots', 'Staggered dots', 'dots', 'dots', 'Staggered dot timing'],
  ['vertical-dots', 'Vertical bouncing dots', 'dots', 'wave', 'Vertical dot bounce'],
  ['equalizer', 'Equalizer bars', 'bars', 'bars', 'Audio equalizer bars'],
  ['bouncing-bars', 'Bouncing bars', 'bars', 'bars', 'Bouncing vertical bars'],
  ['vertical-pulse-bars', 'Vertical pulse bars', 'bars', 'bars', 'Vertical pulse bars'],
  ['horizontal-pulse-bars', 'Horizontal pulse bars', 'bars', 'wave', 'Horizontal pulse bars'],
  ['waveform', 'Waveform', 'bars', 'wave', 'Waveform animation'],
  ['audio-waveform', 'Audio waveform', 'bars', 'wave', 'Audio-style waveform'],
  ['fading-bars', 'Fading bars', 'bars', 'bars', 'Sequential fading bars'],
  ['growing-bars', 'Growing bars', 'bars', 'bars', 'Growing and shrinking bars'],
  ['alternating-bars', 'Alternating bars', 'bars', 'bars', 'Alternating bar motion'],
  ['gradient-bars', 'Gradient bars', 'bars', 'bars', 'Gradient bars'],
  ['segmented-bar', 'Segmented bar', 'progress', 'progress', 'Segmented progress bar'],
  ['moving-stripe', 'Moving stripe', 'bars', 'wave', 'Traveling stripe'],
  ['traveling-highlight', 'Traveling highlight', 'bars', 'wave', 'Highlight sweep'],
  ['oscillating-line', 'Oscillating line', 'bars', 'wave', 'Oscillating line'],
  ['multi-wave', 'Multi-wave', 'bars', 'wave', 'Multiple wave layers'],
  ['ripple-circles', 'Ripple circles', 'creative', 'rings', 'Expanding ripple circles'],
  ['expanding-circles', 'Expanding circles', 'creative', 'rings', 'Expanding concentric circles'],
  ['morphing-shapes', 'Morphing shapes', 'creative', 'shape', 'Morphing geometric shape'],
  ['infinity', 'Infinity loop', 'creative', 'rings', 'Infinity loop'],
  ['helix', 'DNA helix', 'creative', 'wave', 'DNA-style helix'],
  ['cube', 'Cube rotation', 'creative', 'shape', 'Cube rotation'],
  ['polygon', 'Rotating polygon', 'creative', 'shape', 'Rotating polygon'],
  ['triangles', 'Rotating triangles', 'creative', 'shape', 'Rotating triangles'],
  ['folding-squares', 'Folding squares', 'creative', 'shape', 'Folding square motion'],
  ['nested-squares', 'Nested squares', 'creative', 'rings', 'Nested square rotation'],
  ['concentric-pulse', 'Concentric pulse', 'creative', 'rings', 'Pulsing concentric circles'],
  ['spiral', 'Spiral', 'creative', 'ring', 'Spiral sweep'],
  ['radar', 'Radar sweep', 'creative', 'ring', 'Circular radar sweep'],
  ['particle-orbit', 'Particle orbit', 'creative', 'orbit', 'Particle orbit system'],
  ['skeleton-line', 'Skeleton text line', 'skeleton', 'skeleton', 'Single skeleton line'],
  ['skeleton-card', 'Skeleton card', 'skeleton', 'skeleton', 'Card placeholder'],
  ['skeleton-avatar', 'Skeleton avatar', 'skeleton', 'skeleton', 'Avatar placeholder'],
  ['skeleton-table', 'Skeleton table', 'skeleton', 'skeleton', 'Table placeholder'],
  ['skeleton-dashboard', 'Skeleton dashboard', 'skeleton', 'skeleton', 'Dashboard placeholder'],
  ['progress-bar', 'Progress bar', 'progress', 'progress', 'Determinate progress bar'],
  ['progress-ring', 'Progress ring', 'progress', 'progress', 'Determinate circular progress'],
  ['progress-steps', 'Progress steps', 'progress', 'progress', 'Multi-step progress'],
  ['progress-top', 'Top progress', 'progress', 'progress', 'Top-of-page progress'],
  ['progress-upload', 'Upload progress', 'progress', 'progress', 'Upload progress'],
  ['inline', 'Inline loading', 'application', 'pulse', 'Inline application loading'],
  ['button', 'Button loading', 'application', 'pulse', 'Button loading state'],
  ['overlay', 'Section overlay', 'application', 'overlay', 'Section loading overlay'],
  ['fullscreen', 'Full-screen overlay', 'application', 'overlay', 'Full-screen loading overlay'],
  ['page-transition', 'Page transition', 'application', 'progress', 'Page transition indicator'],
  ['image-placeholder', 'Image placeholder', 'application', 'skeleton', 'Image loading placeholder'],
  ['infinite-scroll', 'Infinite scroll', 'application', 'dots', 'Infinite-scroll indicator'],
  ['background-operation', 'Background operation', 'application', 'pulse', 'Background operation indicator']
];

export const loaderRegistry: readonly LoaderDefinition[] = entries.map(([id, name, category, kind, description]) => ({
  id, name, category, kind, description,
  options: ['size', 'color', 'speed', 'label', 'reducedMotion'],
  supportsProgress: category === 'progress',
  stability: 'stable',
  visualSignature: id
}));

const catalogAliases: Record<string, string> = {
  circular: 'ring',
  arc: 'half-circle',
  'multi-arc': 'dual-ring',
  'segmented-ring': 'dotted-circle',
  'thin-line': 'ring',
  'thick-stroke': 'ring',
  monochrome: 'ring',
  'four-dots': 'three-dots',
  'five-dots': 'three-dots',
  'dot-matrix': 'grid-pulse',
  'audio-waveform': 'waveform',
  'gradient-bars': 'equalizer'
};

for (const definition of loaderRegistry) {
  const aliasOf = catalogAliases[definition.id];
  if (aliasOf) {
    definition.deprecated = true;
    definition.aliasOf = aliasOf;
    definition.visualSignature = aliasOf;
    definition.stability = 'experimental';
  }
}

const patternPresets: Array<[string, string]> = [
  ['api-loading', 'inline'], ['form-submit', 'button'], ['search-results', 'three-dots'],
  ['dashboard-cards', 'skeleton-dashboard'], ['product-grid', 'skeleton-card'],
  ['article-layout', 'skeleton-card'], ['profile-page', 'skeleton-avatar'],
  ['table-body', 'skeleton-table'], ['table-header', 'skeleton-table'],
  ['chat-message', 'skeleton-line'], ['notification-list', 'skeleton-line'],
  ['statistics-card', 'skeleton-card'], ['chart-placeholder', 'skeleton-card'],
  ['image-gallery', 'image-placeholder'], ['pricing-card', 'skeleton-card'],
  ['product-details', 'image-placeholder'], ['modal-loading', 'overlay'],
  ['container-loading', 'overlay'], ['icon-button', 'inline'], ['lazy-content', 'skeleton-line'],
  ['download-progress', 'progress-upload'], ['file-processing', 'progress-bar'],
  ['multi-stage', 'progress-steps'], ['branded-minimal', 'ring'],
  ['dark-surface', 'gradient-ring'], ['high-contrast', 'ring'],
  ['compact-inline', 'three-dots'], ['large-display', 'orbiting-circles'],
  ['static-reduced-motion', 'inline'], ['classic-collection', 'ring'],
  ['creative-collection', 'morphing-shapes'], ['skeleton-collection', 'skeleton-card'],
  ['progress-collection', 'progress-bar'], ['ecommerce-collection', 'skeleton-card'],
  ['dashboard-collection', 'skeleton-dashboard']
];

export const presetRegistry = [
  ...loaderRegistry.map((loader) => ({ id: loader.id, name: loader.name, type: loader.aliasOf ?? loader.id })),
  ...patternPresets.map(([id, type]) => ({ id, name: id.replace(/-/g, ' '), type }))
];

export function getLoaderDefinition(type = 'pulse'): LoaderDefinition {
  return loaderRegistry.find((loader) => loader.id === type) ?? loaderRegistry.find((loader) => loader.id === 'inline')!;
}

export function getCanonicalLoaderDefinition(definition: LoaderDefinition): LoaderDefinition {
  const registered = loaderRegistry.find((loader) => loader.id === definition.id) ?? definition;
  return registered.aliasOf
    ? loaderRegistry.find((loader) => loader.id === registered.aliasOf) ?? definition
    : definition;
}
