import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'vertical-dots', name: 'Vertical bouncing dots', category: 'dots', kind: 'wave', description: 'Vertical dot bounce', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const verticalDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);