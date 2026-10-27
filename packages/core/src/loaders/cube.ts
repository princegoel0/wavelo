import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'cube', name: 'Cube rotation', category: 'creative', kind: 'shape', description: 'Cube rotation', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const cube = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);