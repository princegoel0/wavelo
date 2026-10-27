import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'rotating-diamond', name: 'Rotating diamond', category: 'spinner', kind: 'shape', description: 'Rotating diamond', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const rotatingDiamond = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);