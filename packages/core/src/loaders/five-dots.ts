import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'five-dots', name: 'Five dots', category: 'dots', kind: 'dots', description: 'Five-dot sequence', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const fiveDots = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);