import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'scaling-dots', name: 'Scaling dots', category: 'dots', kind: 'pulse', description: 'Scaling dots', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const scalingDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);