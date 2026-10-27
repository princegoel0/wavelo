import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'traveling-highlight', name: 'Traveling highlight', category: 'bars', kind: 'wave', description: 'Highlight sweep', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const travelingHighlight = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);