import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'triangles', name: 'Rotating triangles', category: 'creative', kind: 'shape', description: 'Rotating triangles', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const triangles = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);