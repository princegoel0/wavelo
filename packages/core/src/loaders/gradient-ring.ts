import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'gradient-ring', name: 'Gradient ring', category: 'spinner', kind: 'ring', description: 'Gradient ring sweep', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const gradientRing = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);