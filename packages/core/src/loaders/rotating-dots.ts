import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'rotating-dots', name: 'Rotating dots', category: 'dots', kind: 'orbit', description: 'Rotating dots', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const rotatingDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);