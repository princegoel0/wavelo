import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'orbiting-dots', name: 'Orbiting dots', category: 'spinner', kind: 'orbit', description: 'Dots orbiting a center', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const orbit = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);
