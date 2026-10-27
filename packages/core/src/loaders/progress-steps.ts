import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'progress-steps', name: 'Progress steps', category: 'progress', kind: 'progress', description: 'Multi-step progress', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable', supportsProgress: true };
export const progressSteps = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);