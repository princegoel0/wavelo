import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'ring', name: 'Ring', category: 'spinner', kind: 'ring', description: 'Open ring spinner', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const ring = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);