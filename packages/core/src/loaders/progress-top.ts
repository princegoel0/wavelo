import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'progress-top', name: 'Top progress', category: 'progress', kind: 'progress', description: 'Top-of-page progress', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable', supportsProgress: true };
export const progressTop = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);