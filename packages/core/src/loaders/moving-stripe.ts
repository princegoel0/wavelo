import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'moving-stripe', name: 'Moving stripe', category: 'bars', kind: 'wave', description: 'Traveling stripe', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const movingStripe = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);