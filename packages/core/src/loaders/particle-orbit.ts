import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'particle-orbit', name: 'Particle orbit', category: 'creative', kind: 'orbit', description: 'Particle orbit system', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const particleOrbit = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);