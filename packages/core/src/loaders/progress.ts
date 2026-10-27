import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'progress-bar', name: 'Progress bar', category: 'progress', kind: 'progress', description: 'Determinate progress bar', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], supportsProgress: true, stability: 'stable' };
export const progress = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);
