import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'dual-ring', name: 'Dual ring', category: 'spinner', kind: 'rings', description: 'Nested dual-ring rotation', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const dualRing = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);