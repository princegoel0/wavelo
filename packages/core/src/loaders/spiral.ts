import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'spiral', name: 'Spiral', category: 'creative', kind: 'ring', description: 'Spiral sweep', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const spiral = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);