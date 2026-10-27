import { createElement, useMemo } from 'react';
import { renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';

export type WaveloProps = LoaderConfig;

export function Loader(props: WaveloProps = {}): ReturnType<typeof createElement> {
  const result = useMemo(() => renderLoader(props), [JSON.stringify(props)]);
  return createElement('span', {
    dangerouslySetInnerHTML: { __html: `<style>${result.css}</style>${result.html}` }
  });
}

export function renderReactLoader(props: WaveloProps = {}): RenderResult {
  return renderLoader(props);
}
