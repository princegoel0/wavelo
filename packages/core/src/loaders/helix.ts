import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'helix', name: 'DNA helix', category: 'creative', kind: 'wave', description: 'DNA-style helix', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const helix = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);