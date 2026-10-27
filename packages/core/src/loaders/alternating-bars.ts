import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'alternating-bars', name: 'Alternating bars', category: 'bars', kind: 'bars', description: 'Alternating bar motion', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const alternatingBars = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);