import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'dot-wave', name: 'Dot wave', category: 'dots', kind: 'wave', description: 'Wave of dots', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const dotWave = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);