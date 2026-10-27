import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'growing-bars', name: 'Growing bars', category: 'bars', kind: 'bars', description: 'Growing and shrinking bars', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const growingBars = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);