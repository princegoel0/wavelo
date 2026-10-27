import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'background-operation', name: 'Background operation', category: 'application', kind: 'pulse', description: 'Background operation indicator', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const backgroundOperation = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);