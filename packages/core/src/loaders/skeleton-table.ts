import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'skeleton-table', name: 'Skeleton table', category: 'skeleton', kind: 'skeleton', description: 'Table placeholder', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const skeletonTable = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);