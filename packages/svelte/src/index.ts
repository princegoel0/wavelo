import { renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';
export type WaveloProps = LoaderConfig;
export function renderSvelteLoader(props: WaveloProps = {}): RenderResult { return renderLoader(props); }
