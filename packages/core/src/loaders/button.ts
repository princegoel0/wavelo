import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'button', name: 'Button loading', category: 'application', kind: 'pulse', description: 'Button loading state', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const button = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);