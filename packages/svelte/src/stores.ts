import { derived, writable, type Readable } from 'svelte/store';

export type WaveloState = 'idle' | 'loading' | 'success' | 'error';

export interface WaveloStateOptions {
  initial?: WaveloState;
  resetTimeout?: number;
  onChange?: (state: WaveloState) => void;
}

export interface WaveloStateProps {
  loading: boolean;
  'data-wavelo-state': WaveloState;
}

export interface WaveloStateStore extends Readable<WaveloState> {
  stateProps: Readable<WaveloStateProps>;
  startLoading: () => void;
  setSuccess: (customTimeout?: number) => void;
  setError: (customTimeout?: number) => void;
  reset: () => void;
  wrapAsync: <T>(promiseOrFn: Promise<T> | (() => Promise<T>)) => Promise<T>;
  destroy: () => void;
}

export function waveloState(options: WaveloStateOptions = {}): WaveloStateStore {
  const { initial = 'idle', resetTimeout = 1800, onChange } = options;
  const state = writable<WaveloState>(initial);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
  };

  const changeState = (next: WaveloState) => {
    state.set(next);
    onChange?.(next);
  };

  const reset = () => {
    clearTimer();
    changeState('idle');
  };

  const startLoading = () => {
    clearTimer();
    changeState('loading');
  };

  const scheduleReset = (next: WaveloState, customTimeout?: number) => {
    clearTimer();
    changeState(next);
    const timeout = customTimeout ?? resetTimeout;
    if (timeout > 0) timer = setTimeout(() => {
      timer = null;
      changeState('idle');
    }, timeout);
  };

  const setSuccess = (customTimeout?: number) => scheduleReset('success', customTimeout);
  const setError = (customTimeout?: number) => scheduleReset('error', customTimeout);

  async function wrapAsync<T>(promiseOrFn: Promise<T> | (() => Promise<T>)): Promise<T> {
    startLoading();
    try {
      const result = await (typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn);
      setSuccess();
      return result;
    } catch (error) {
      setError();
      throw error;
    }
  }

  return {
    subscribe: state.subscribe,
    stateProps: derived(state, value => ({ loading: value === 'loading', 'data-wavelo-state': value })),
    startLoading,
    setSuccess,
    setError,
    reset,
    wrapAsync,
    destroy: clearTimer
  };
}

export interface WaveloProgressOptions {
  initial?: number;
  autoStart?: boolean;
  mode?: 'natural' | 'linear' | 'manual';
  duration?: number;
  onComplete?: () => void;
}

export interface WaveloProgressStore extends Readable<number> {
  percent: Readable<string>;
  isComplete: Readable<boolean>;
  start: () => void;
  pause: () => void;
  finish: () => void;
  reset: (newInitial?: number) => void;
  setProgress: (value: number | ((previous: number) => number)) => void;
  destroy: () => void;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function waveloProgress(options: WaveloProgressOptions = {}): WaveloProgressStore {
  const { initial = 0, autoStart = false, mode = 'natural', duration = 3000, onComplete } = options;
  const progress = writable<number>(clamp(initial));
  let current = clamp(initial);
  const write = (value: number) => {
    current = value;
    progress.set(value);
  };
  let running = autoStart;
  let timer: ReturnType<typeof setInterval> | null = null;

  const clearTimer = () => {
    if (timer !== null) clearInterval(timer);
    timer = null;
  };

  const complete = () => {
    clearTimer();
    running = false;
    write(100);
    onComplete?.();
  };

  const tick = () => {
    if (timer !== null || !running || mode === 'manual' || current >= 100) return;
    const intervalMs = 50;
    const steps = Math.max(1, duration / intervalMs);
    timer = setInterval(() => {
      const previous = current;
      if (previous >= 100) {
        complete();
        return;
      }
      let next: number;
      if (mode === 'linear') {
        next = previous + 100 / steps;
      } else if (previous < 90) {
        next = previous + Math.max(0.2, ((90 - previous) / steps) * 1.5);
      } else {
        next = previous + 0.05;
      }
      write(Math.min(mode === 'natural' && previous >= 90 ? 98 : 100, Math.round(next * 10) / 10));
      if (current >= 100) complete();
    }, intervalMs);
  };

  const start = () => {
    if (current >= 100) return;
    running = true;
    tick();
  };

  const pause = () => {
    running = false;
    clearTimer();
  };

  const finish = () => complete();

  const reset = (newInitial: number = initial) => {
    clearTimer();
    running = false;
    write(clamp(newInitial));
  };

  const setProgress = (value: number | ((previous: number) => number)) => {
    const previous = current;
    const next = clamp(typeof value === 'function' ? value(previous) : value);
    write(next);
    if (next >= 100 && previous < 100) {
      clearTimer();
      running = false;
      onComplete?.();
    }
  };

  if (autoStart && typeof window !== 'undefined') start();

  return {
    subscribe: progress.subscribe,
    percent: derived(progress, value => `${Math.round(value)}%`),
    isComplete: derived(progress, value => value >= 100),
    start,
    pause,
    finish,
    reset,
    setProgress,
    destroy: clearTimer
  };
}
