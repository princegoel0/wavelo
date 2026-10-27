import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'ellipse', name: 'Elliptical spinner', category: 'spinner', kind: 'ring', description: 'Elliptical rotation', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const ellipse = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);