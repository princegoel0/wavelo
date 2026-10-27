import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'polygon', name: 'Rotating polygon', category: 'creative', kind: 'shape', description: 'Rotating polygon', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const polygon = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);