import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'bouncing-bars', name: 'Bouncing bars', category: 'bars', kind: 'bars', description: 'Bouncing vertical bars', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const bouncingBars = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);