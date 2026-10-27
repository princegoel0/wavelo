import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'fading-bars', name: 'Fading bars', category: 'bars', kind: 'bars', description: 'Sequential fading bars', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const fadingBars = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);