import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'circular', name: 'Circular border', category: 'spinner', kind: 'ring', description: 'Classic circular border spinner', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const circular = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);