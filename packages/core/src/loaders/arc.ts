import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'arc', name: 'Rotating arc', category: 'spinner', kind: 'ring', description: 'Single rotating arc', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const arc = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);