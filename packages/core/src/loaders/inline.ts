import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'inline', name: 'Inline loading', category: 'application', kind: 'pulse', description: 'Inline application loading', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const inline = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);