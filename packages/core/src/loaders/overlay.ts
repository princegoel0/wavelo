import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'overlay', name: 'Section overlay', category: 'application', kind: 'overlay', description: 'Section loading overlay', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const overlay = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);