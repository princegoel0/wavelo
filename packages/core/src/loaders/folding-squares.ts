import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'folding-squares', name: 'Folding squares', category: 'creative', kind: 'shape', description: 'Folding square motion', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const foldingSquares = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);