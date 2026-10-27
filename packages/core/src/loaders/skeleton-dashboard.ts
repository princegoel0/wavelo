import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'skeleton-dashboard', name: 'Skeleton dashboard', category: 'skeleton', kind: 'skeleton', description: 'Dashboard placeholder', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const skeletonDashboard = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);