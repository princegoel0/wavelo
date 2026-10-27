import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'equalizer', name: 'Equalizer bars', category: 'bars', kind: 'bars', description: 'Audio equalizer bars', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const equalizer = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);