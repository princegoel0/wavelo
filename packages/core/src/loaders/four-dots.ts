import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'four-dots', name: 'Four dots', category: 'dots', kind: 'dots', description: 'Four-dot sequence', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const fourDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);