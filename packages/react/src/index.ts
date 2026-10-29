import { createContext, createElement, useContext, useEffect, type ReactNode } from 'react';
import { ensureStyles, mergeWaveloConfig, renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult, WaveloDefaults } from '@wavelo/core';

export type WaveloProps = LoaderConfig;

const WaveloDefaultsContext = createContext<WaveloDefaults | null>(null);

/**
 * Options every loader inside `children` inherits — colour, size, speed, reduced
 * motion — so a page sets its house style once instead of at each call site. A
 * value passed to an individual `<Loader>` always wins.
 */
export function WaveloProvider({ defaults, children }: { defaults: WaveloDefaults; children?: ReactNode }) {
  return createElement(WaveloDefaultsContext.Provider, { value: defaults }, children);
}

/** The defaults in effect for this subtree, for components that build their own config. */
export function useWaveloDefaults(): WaveloDefaults | null {
  return useContext(WaveloDefaultsContext);
}

/**
 * Renders a design. The stylesheet slice goes into `document.head` once per
 * unique slice, so any number of loaders shares one element. For server
 * rendering, include the sheet in the document head once — import
 * `@wavelo/core/styles.css`, or render `renderReactLoader(...).css` there.
 */
export function Loader(props: WaveloProps = {}) {
  const result = renderLoader(mergeWaveloConfig(useContext(WaveloDefaultsContext), props));
  useEffect(() => {
    ensureStyles(result.css);
  }, [result.css]);
  return createElement('span', {
    // The markup is core's own output: every config value is escaped or
    // rejected by validation before it reaches this string.
    className: 'wavelo-host',
    dangerouslySetInnerHTML: { __html: result.html }
  });
}

/** The render result without React, for server rendering and tests. */
export function renderReactLoader(props: WaveloProps = {}, defaults?: WaveloDefaults): RenderResult {
  return renderLoader(mergeWaveloConfig(defaults, props));
}
