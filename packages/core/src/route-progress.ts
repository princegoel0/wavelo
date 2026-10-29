import { mountLoader } from './dom.js';
import type { LoaderConfig } from './types.js';

export interface RouteProgressOptions {
  /** How often the bar creeps toward its ceiling, in milliseconds. */
  trickle?: number;
  /** The percentage a slow route creeps toward; only `done()` takes it past that. */
  ceiling?: number;
  /** How long the completed bar stays on screen, in milliseconds. */
  hold?: number;
}

export interface RouteProgress {
  /** The element the bar is mounted into; `null` during server rendering. */
  readonly element: HTMLElement | null;
  /** True between `start()` and the end of the completed bar's hold. */
  readonly visible: boolean;
  /** Begins a route change. Calling it again restarts the bar. */
  start(): void;
  /** Pins the bar to a percentage, for a router that reports real progress. */
  set(value: number): void;
  /** Ends the route change: fill, hold briefly, then take the bar out. */
  done(): void;
  /** Takes the bar out at once, for a navigation that was replaced or aborted. */
  destroy(): void;
}

/**
 * A top-of-page progress bar for route changes, which is the one thing every app
 * writes for itself: `start()` on the navigation, `done()` when the new page is
 * there. Between them the bar creeps toward `ceiling`, because a route that is
 * taking long is not at 100% yet, and it never finishes until told to.
 *
 * The bar carries no label, so assistive technology is not told about it: a route
 * change is announced by the page's own focus movement, and a second announcement
 * of "loading" would be the library talking over the application. Pass
 * `{ label: 'Loading page' }` in `config` to say it anyway.
 *
 * Nothing is scheduled and nothing is appended during server rendering.
 */
export function createRouteProgress(config: LoaderConfig = {}, options: RouteProgressOptions = {}): RouteProgress {
  const trickle = options.trickle ?? 300;
  const ceiling = Math.min(99, Math.max(1, options.ceiling ?? 90));
  const hold = options.hold ?? 250;
  if (typeof document === 'undefined') {
    const nothing = () => {};
    return { element: null, visible: false, start: nothing, set: nothing, done: nothing, destroy: nothing };
  }
  const element = document.createElement('div');
  // `display: contents` comes from the sheet, so the wrapper adds no box of its own.
  element.className = 'wavelo-host';
  element.setAttribute('data-wavelo-route-progress', '');

  let value = 0;
  let creeping: ReturnType<typeof setInterval> | undefined;
  let finishing: ReturnType<typeof setTimeout> | undefined;

  const render = (loading: boolean) => {
    mountLoader(element, { type: 'progress-top', value, max: 100, loading, ...config });
  };
  const stop = () => {
    if (creeping !== undefined) clearInterval(creeping);
    if (finishing !== undefined) clearTimeout(finishing);
    creeping = undefined;
    finishing = undefined;
  };
  const attach = () => {
    if (!element.isConnected) document.body.append(element);
  };
  const destroy = () => {
    stop();
    element.remove();
  };

  return {
    element,
    get visible() {
      return element.isConnected;
    },
    start() {
      stop();
      value = 0;
      attach();
      render(true);
      creeping = setInterval(() => {
        // Each step closes a fixed fraction of the remaining gap, so the bar always
        // moves and never claims a route is nearly over when it is not.
        value = Math.min(ceiling, value + (ceiling - value) * 0.12 + 0.5);
        render(true);
      }, trickle);
    },
    set(next: number) {
      stop();
      value = Math.max(0, Math.min(100, next));
      attach();
      render(true);
    },
    done() {
      stop();
      value = 100;
      attach();
      render(true);
      finishing = setTimeout(destroy, hold);
    },
    destroy
  };
}
