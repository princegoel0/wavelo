import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'infinite-scroll', name: 'Infinite scroll', category: 'application', kind: 'dots', description: 'Infinite-scroll indicator', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const infiniteScroll = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);