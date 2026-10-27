import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'ripple-dot', name: 'Ripple dot', category: 'dots', kind: 'rings', description: 'Ripple from a dot', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const rippleDot = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);