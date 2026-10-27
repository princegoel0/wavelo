import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'fullscreen', name: 'Full-screen overlay', category: 'application', kind: 'overlay', description: 'Full-screen loading overlay', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const fullscreen = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);