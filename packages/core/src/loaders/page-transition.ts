import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'page-transition', name: 'Page transition', category: 'application', kind: 'progress', description: 'Page transition indicator', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const pageTransition = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);