import { renderLoaderWithDefinition } from '../render.js';
import { LoaderConfig, LoaderDefinition } from '../types.js';

const definition: LoaderDefinition = { id: 'audio-waveform', name: 'Audio waveform', category: 'bars', kind: 'wave', description: 'Audio-style waveform', options: ['size', 'color', 'speed', 'label', 'reducedMotion'], stability: 'stable' };
export const audioWaveform = (config: Omit<LoaderConfig, 'type'> = {}) => renderLoaderWithDefinition({ ...config, type: definition.id }, definition);