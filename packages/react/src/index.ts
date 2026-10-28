import { createElement, useEffect } from 'react';
import { ensureStyles, renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';

export type WaveloProps = LoaderConfig;

/**
 * Renders a design. The stylesheet slice goes into `document.head` once per
 * unique slice, so any number of loaders shares one element. For server
 * rendering, include the sheet in the document head once — import
 * `@wavelo/core/styles.css`, or render `renderReactLoader(...).css` there.
 */
export function Loader(props: WaveloProps = {}) {
  const result = renderLoader(props);
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
export function renderReactLoader(props: WaveloProps = {}): RenderResult {
  return renderLoader(props);
}
