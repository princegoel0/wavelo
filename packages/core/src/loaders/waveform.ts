import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'waveform', name: 'Waveform', category: 'bars', kind: 'wave', description: 'Waveform animation', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const waveform = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);