import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'oscillating-line', name: 'Oscillating line', category: 'bars', kind: 'wave', description: 'Oscillating line', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const oscillatingLine = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);