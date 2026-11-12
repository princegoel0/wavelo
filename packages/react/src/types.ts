import type { LoaderConfig, WaveloDefaults } from '@wavelo/core';
import type { ReactNode } from 'react';

export type WaveloProps = LoaderConfig;

/**
 * Options every loader inside `children` inherits — colour, size, speed, reduced
 * motion — so a page sets its house style once instead of at each call site. A
 * value passed to an individual `<Loader>` always wins.
 */
export interface WaveloProviderProps {
  /** House style defaults to apply across the subtree. */
  defaults?: WaveloDefaults;
  /** Standard React context value alias for defaults. */
  value?: WaveloDefaults;
  children?: ReactNode;
}
