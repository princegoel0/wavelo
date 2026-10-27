import { defineComponent, h, type PropType } from 'vue';
import { renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';
export type WaveloProps = LoaderConfig;
export const Loader = defineComponent({
  name: 'WaveloLoader',
  props: {
    type: String,
    size: [String, Number] as PropType<LoaderConfig['size']>,
    color: String,
    label: String,
    value: Number,
    max: Number,
    reducedMotion: String as PropType<LoaderConfig['reducedMotion']>
  },
  setup(props) {
    return () => {
      const result = renderLoader(props);
      return h('span', { innerHTML: `<style>${result.css}</style>${result.html}` });
    };
  }
});
export function renderVueLoader(props: WaveloProps = {}): RenderResult { return renderLoader(props); }
