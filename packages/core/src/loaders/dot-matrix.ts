import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'dot-matrix', name: 'Dot matrix', category: 'dots', kind: 'dots', description: 'Matrix pulse', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const dotMatrix = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);