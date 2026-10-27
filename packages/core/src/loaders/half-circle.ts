import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'half-circle', name: 'Half circle', category: 'spinner', kind: 'ring', description: 'Half-circle sweep', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const halfCircle = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);