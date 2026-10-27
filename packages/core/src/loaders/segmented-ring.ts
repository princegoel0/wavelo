import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'segmented-ring', name: 'Segmented ring', category: 'spinner', kind: 'rings', description: 'Segmented circular indicator', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const segmentedRing = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);