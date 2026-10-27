import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'thick-stroke', name: 'Thick stroke', category: 'spinner', kind: 'ring', description: 'Bold stroke spinner', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const thickStroke = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);