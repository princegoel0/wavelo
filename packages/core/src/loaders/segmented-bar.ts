import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'segmented-bar', name: 'Segmented bar', category: 'progress', kind: 'progress', description: 'Segmented progress bar', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable', supportsProgress: true };
export const segmentedBar = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);