import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'infinity', name: 'Infinity loop', category: 'creative', kind: 'rings', description: 'Infinity loop', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const infinity = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);