import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'horizontal-pulse-bars', name: 'Horizontal pulse bars', category: 'bars', kind: 'wave', description: 'Horizontal pulse bars', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const horizontalPulseBars = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);