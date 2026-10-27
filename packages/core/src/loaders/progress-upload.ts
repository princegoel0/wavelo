import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'progress-upload', name: 'Upload progress', category: 'progress', kind: 'progress', description: 'Upload progress', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable', supportsProgress: true };
export const progressUpload = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);