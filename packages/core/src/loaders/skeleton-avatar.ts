import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'skeleton-avatar', name: 'Skeleton avatar', category: 'skeleton', kind: 'skeleton', description: 'Avatar placeholder', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const skeletonAvatar = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);