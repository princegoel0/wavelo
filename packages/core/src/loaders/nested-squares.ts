import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'nested-squares', name: 'Nested squares', category: 'creative', kind: 'rings', description: 'Nested square rotation', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const nestedSquares = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);