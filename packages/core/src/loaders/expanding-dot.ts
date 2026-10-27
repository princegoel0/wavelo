import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'expanding-dot', name: 'Expanding dot', category: 'dots', kind: 'pulse', description: 'Expanding dot', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const expandingDot = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);