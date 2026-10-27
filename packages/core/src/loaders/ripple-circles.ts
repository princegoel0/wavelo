import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'ripple-circles', name: 'Ripple circles', category: 'creative', kind: 'rings', description: 'Expanding ripple circles', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const rippleCircles = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);