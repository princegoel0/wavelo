import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'multi-arc', name: 'Multiple arcs', category: 'spinner', kind: 'rings', description: 'Layered rotating arcs', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const multiArc = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);