import { createContext, createElement, useContext, useEffect, type FC, type ReactNode } from 'react';
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
  // `loading={false}` renders nothing at all, so the hidden state leaves no empty
  // element behind.
  if (!result.html) return null;
  return createElement('span', {
    // The markup is core's own output: every config value is escaped or
    // rejected by validation before it reaches this string.
    className: 'wavelo-host',
    dangerouslySetInnerHTML: { __html: result.html }
  });
}

/**
 * A component bound to one design and the options it always uses, so a call site
 * reads `<ButtonSpinner loading={busy} />` instead of repeating a configuration.
 * Precedence, lowest to highest: `WaveloProvider` defaults, these bound defaults,
 * the props passed at the call site.
 */
/** `skeleton-line` becomes `WaveloSkeletonLine`, the name React DevTools shows. */
const componentName = (type: string) => `Wavelo${type.split(/[-_]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;

export function loaderFor(type: string, defaults: WaveloDefaults = {}): FC<WaveloProps> {
  const bound = mergeWaveloConfig(defaults, { type });
  // Called as a function rather than through createElement: the bound defaults are
  // this component's own props, and one fiber holding both keeps the hook order
  // stable whatever the call site passes.
  const component: FC<WaveloProps> = (props = {}) => Loader(mergeWaveloConfig(bound, props));
  component.displayName = componentName(type);
  return component;
}

/** The render result without React, for server rendering and tests. */
export function renderReactLoader(props: WaveloProps = {}, defaults?: WaveloDefaults): RenderResult {
  return renderLoader(mergeWaveloConfig(defaults, props));
}
