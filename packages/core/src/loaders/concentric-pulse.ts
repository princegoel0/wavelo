import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'concentric-pulse', name: 'Concentric pulse', category: 'creative', kind: 'rings', description: 'Pulsing concentric circles', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const concentricPulse = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);