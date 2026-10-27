import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'grid-pulse', name: 'Grid pulse', category: 'dots', kind: 'pulse', description: 'Grid pulse', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const gridPulse = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);