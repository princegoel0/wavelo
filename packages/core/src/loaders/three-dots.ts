import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'three-dots', name: 'Three dots', category: 'dots', kind: 'dots', description: 'Three-dot sequence', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const threeDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);