import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'expanding-circles', name: 'Expanding circles', category: 'creative', kind: 'rings', description: 'Expanding concentric circles', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const expandingCircles = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);