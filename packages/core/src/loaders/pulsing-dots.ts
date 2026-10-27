import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'pulsing-dots', name: 'Pulsing dots', category: 'dots', kind: 'pulse', description: 'Sequential pulse', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const pulsingDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);