import { computed, defineComponent, h, useAttrs, watchEffect, type PropType } from 'vue';
import { ensureStyles, loaderConfigKeys, renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';

export type WaveloProps = LoaderConfig;

// `data-*` keys arrive as fallthrough attributes rather than declared props.
const declaredKeys = loaderConfigKeys.filter((key) => !key.startsWith('data-'));

const props = Object.fromEntries(
  declaredKeys.map((key) => {
    if (key === 'paused') return [key, Boolean as PropType<false>];
    if (key === 'value' || key === 'max' || key === 'speed' || key === 'strokeWidth') return [key, Number as PropType<number>];
    if (key === 'size' || key === 'width' || key === 'height' || key === 'duration') return [key, [String, Number] as PropType<string | number>];
    if (key === 'style') return [key, Object as PropType<Record<string, string | number>>];
    return [key, String as PropType<string>];
  })
);

/**
 * Renders a design. Styles go into `document.head` once per slice; server
 * rendering should include `@wavelo/core/styles.css` in the head instead.
 */
export const Loader = defineComponent({
  name: 'WaveloLoader',
  props,
  inheritAttrs: false,
  setup(source) {
    const attrs = useAttrs();
    const result = computed(() => {
      const dataAttributes: Record<string, string> = {};
      for (const [name, value] of Object.entries(attrs)) {
        if (name.startsWith('data-') && typeof value === 'string') dataAttributes[name] = value;
      }
      return renderLoader({ ...source, ...dataAttributes } as LoaderConfig);
    });
    watchEffect(() => ensureStyles(result.value.css));
    return () => h('span', { class: 'wavelo-host', innerHTML: result.value.html });
  }
});

/** The render result without Vue, for server rendering and tests. */
export function renderVueLoader(props: WaveloProps = {}): RenderResult {
  return renderLoader(props);
}
