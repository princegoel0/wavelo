import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'orbiting-circles', name: 'Orbiting circles', category: 'spinner', kind: 'orbit', description: 'Circles orbiting a center', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const orbitingCircles = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);