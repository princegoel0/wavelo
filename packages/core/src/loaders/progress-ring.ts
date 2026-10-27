import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'progress-ring', name: 'Progress ring', category: 'progress', kind: 'progress', description: 'Determinate circular progress', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable', supportsProgress: true };
export const progressRing = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);