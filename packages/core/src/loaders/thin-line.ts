import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'thin-line', name: 'Thin line', category: 'spinner', kind: 'ring', description: 'Minimal thin line', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const thinLine = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);