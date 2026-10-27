import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'image-placeholder', name: 'Image placeholder', category: 'application', kind: 'skeleton', description: 'Image loading placeholder', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const imagePlaceholder = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);