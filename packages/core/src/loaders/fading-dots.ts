import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'fading-dots', name: 'Fading dots', category: 'dots', kind: 'dots', description: 'Fading dot sequence', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const fadingDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);