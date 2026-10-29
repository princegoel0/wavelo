import { computed, defineComponent, h, inject, provide, useAttrs, watchEffect, type DefineComponent, type InjectionKey, type PropType } from 'vue';
import { ensureStyles, loaderConfigKeys, mergeWaveloConfig, renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult, WaveloDefaults } from '@wavelo/core';

export type WaveloProps = LoaderConfig;

/** Injection key for the defaults every `<Loader>` in this subtree inherits. */
export const waveloDefaultsKey: InjectionKey<WaveloDefaults> = Symbol('wavelo-defaults');

/** Call in a parent's `setup` to set colour, size, speed and the rest once. */
export function provideWaveloDefaults(defaults: WaveloDefaults): void {
  provide(waveloDefaultsKey, defaults);
}

// `data-*` keys arrive as fallthrough attributes rather than declared props.
const declaredKeys = loaderConfigKeys.filter((key) => !key.startsWith('data-'));

const booleanKeys = new Set(['paused', 'decorative', 'loading', 'inline']);
const numericKeys = new Set(['value', 'max', 'speed', 'strokeWidth', 'count']);
const lengthKeys = new Set(['size', 'width', 'height', 'duration']);

const props = Object.fromEntries(
  declaredKeys.map((key) => {
    // Declared without a type on purpose. Vue casts an absent Boolean prop to
    // `false`, which would erase a registered default and hide a loader nobody
    // asked to hide; untyped props stay `undefined` when not passed, and the core
    // validation reads `''`, `'false'` and real booleans as the same three states.
    if (booleanKeys.has(key)) return [key, null];
    if (numericKeys.has(key)) return [key, Number as PropType<number>];
    if (lengthKeys.has(key)) return [key, [String, Number] as PropType<string | number>];
    if (key === 'style') return [key, Object as PropType<Record<string, string | number>>];
    return [key, String as PropType<string>];
  })
);

/** `skeleton-line` becomes `WaveloSkeletonLine`, the name DevTools shows. */
const componentName = (type: string) => `Wavelo${type.split(/[-_]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;

/**
 * A component over the full configuration surface. `bound` options are those baked
 * into the component itself; they beat the injected defaults and lose to the props
 * written at the call site.
 */
function defineLoader(name: string, bound: LoaderConfig) {
  return defineComponent({
    name,
    props,
    inheritAttrs: false,
    setup(source) {
      const attrs = useAttrs();
      const defaults = inject(waveloDefaultsKey, null);
      const result = computed(() => {
        const dataAttributes: Record<string, string> = {};
        for (const [key, value] of Object.entries(attrs)) {
          if (key.startsWith('data-') && typeof value === 'string') dataAttributes[key] = value;
        }
        const own = mergeWaveloConfig(bound, { ...source, ...dataAttributes } as LoaderConfig);
        return renderLoader(mergeWaveloConfig(defaults, own));
      });
      watchEffect(() => ensureStyles(result.value.css));
      // `loading={false}` renders nothing at all rather than an empty element.
      return () => (result.value.html ? h('span', { class: 'wavelo-host', innerHTML: result.value.html }) : null);
    }
  });
}

/**
 * Renders a design. Styles go into `document.head` once per slice; server
 * rendering should include `@wavelo/core/styles.css` in the head instead.
 */
export const Loader = defineLoader('WaveloLoader', {});

/**
 * A component bound to one design and the options it always uses:
 * `const ButtonSpinner = loaderFor('ring', { size: 16, color: '#fff' })`, then
 * `<ButtonSpinner :loading="busy" />`.
 */
export function loaderFor(type: string, defaults: WaveloDefaults = {}): DefineComponent {
  return defineLoader(componentName(type), { ...defaults, type }) as unknown as DefineComponent;
}

/** The render result without Vue, for server rendering and tests. */
export function renderVueLoader(props: WaveloProps = {}, defaults?: WaveloDefaults): RenderResult {
  return renderLoader(mergeWaveloConfig(defaults, props));
}
