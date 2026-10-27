import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'vertical-pulse-bars', name: 'Vertical pulse bars', category: 'bars', kind: 'bars', description: 'Vertical pulse bars', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const verticalPulseBars = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);