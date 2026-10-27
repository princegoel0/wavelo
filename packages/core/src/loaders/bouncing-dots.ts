import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'bouncing-dots', name: 'Bouncing dots', category: 'dots', kind: 'dots', description: 'Bouncing dot rhythm', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const bouncingDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);