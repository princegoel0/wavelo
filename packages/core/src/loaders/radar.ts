import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'radar', name: 'Radar sweep', category: 'creative', kind: 'ring', description: 'Circular radar sweep', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const radar = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);