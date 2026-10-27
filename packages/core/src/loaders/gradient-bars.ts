import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'gradient-bars', name: 'Gradient bars', category: 'bars', kind: 'bars', description: 'Gradient bars', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const gradientBars = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);