import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'staggered-dots', name: 'Staggered dots', category: 'dots', kind: 'dots', description: 'Staggered dot timing', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const staggeredDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);