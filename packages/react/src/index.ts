// The package entry declares no client boundary directive on purpose: that
// directive lives in client.js, one import down. A Server Component that reads
// through this entry gets a client reference for the components and a plain
// server module for `renderReactLoader`, so neither import drags the other
// across the boundary.
export { Loader, Wavelo, loaderFor, useWaveloDefaults, WaveloProvider } from './client.js';
export { renderReactLoader } from './server.js';
export * from './hooks.js';
export type { WaveloProps, WaveloProviderProps } from './types.js';
