import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'multi-wave', name: 'Multi-wave', category: 'bars', kind: 'wave', description: 'Multiple wave layers', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const multiWave = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);