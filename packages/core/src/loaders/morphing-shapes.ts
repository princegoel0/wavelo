import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'morphing-shapes', name: 'Morphing shapes', category: 'creative', kind: 'shape', description: 'Morphing geometric shape', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const morphingShapes = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);