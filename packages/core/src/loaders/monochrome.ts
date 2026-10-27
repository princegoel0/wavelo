import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'monochrome', name: 'Monochrome', category: 'spinner', kind: 'ring', description: 'Minimal monochrome spinner', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const monochrome = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);