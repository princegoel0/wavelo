import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'svg-star', name: 'SVG star', category: 'spinner', kind: 'shape', description: 'Star-shaped SVG spinner', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const svgStar = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);