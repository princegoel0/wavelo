import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'rotating-square', name: 'Rotating square', category: 'spinner', kind: 'shape', description: 'Rotating square', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const rotatingSquare = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);