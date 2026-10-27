import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'skeleton-line', name: 'Skeleton text line', category: 'skeleton', kind: 'skeleton', description: 'Single skeleton line', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const skeletonLine = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);