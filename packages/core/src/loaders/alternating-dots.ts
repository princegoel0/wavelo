import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'alternating-dots', name: 'Alternating dots', category: 'dots', kind: 'dots', description: 'Alternating dot groups', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const alternatingDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);