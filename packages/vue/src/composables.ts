import { computed, getCurrentInstance, onUnmounted, ref, type ComputedRef, type Ref } from 'vue';

export type WaveloState = 'idle' | 'loading' | 'success' | 'error';

export interface UseWaveloStateOptions {
  /** Initial state (default: 'idle'). */
  initial?: WaveloState;
  /** Milliseconds before auto-resetting from success/error to idle (default: 1800, 0 disables). */
  resetTimeout?: number;
  /** State change callback. */
  onChange?: (state: WaveloState) => void;
}

export interface UseWaveloStateReturn {
  /** The reactive micro-interaction state. */
  state: Ref<WaveloState>;
  /** Transitions to 'loading'. */
  startLoading: () => void;
  /** Transitions to 'success' (auto-reverting to 'idle' after resetTimeout). */
  setSuccess: (customTimeout?: number) => void;
  /** Transitions to 'error' (auto-reverting to 'idle' after resetTimeout). */
  setError: (customTimeout?: number) => void;
  /** Immediately resets back to 'idle'. */
  reset: () => void;
  /** Helper wrapping any Promise to auto-handle idle -> loading -> success / error transitions. */
  wrapAsync: <T>(promiseOrFn: Promise<T> | (() => Promise<T>)) => Promise<T>;
  /** Computed props ready to bind directly onto <Wavelo v-bind="stateProps" /> */
  stateProps: ComputedRef<{
    loading: boolean;
    'data-wavelo-state': WaveloState;
  }>;
}

/**
 * Manages the asynchronous lifecycle and micro-interaction morph states
 * ('idle' -> 'loading' -> 'success' | 'error') with auto-revert timers and
 * promise interception.
 */
export function useWaveloState(options: UseWaveloStateOptions = {}): UseWaveloStateReturn {
  const { initial = 'idle', resetTimeout = 1800, onChange } = options;
  const state = ref<WaveloState>(initial);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const changeState = (next: WaveloState) => {
    state.value = next;
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

  const setSuccess = (customTimeout?: number) => {
    clearTimer();
    changeState('success');
    const timeout = customTimeout ?? resetTimeout;
    if (timeout > 0) {
      timer = setTimeout(() => {
        changeState('idle');
        timer = null;
      }, timeout);
    }
  };

  const setError = (customTimeout?: number) => {
    clearTimer();
    changeState('error');
    const timeout = customTimeout ?? resetTimeout;
    if (timeout > 0) {
      timer = setTimeout(() => {
        changeState('idle');
        timer = null;
      }, timeout);
    }
  };

  const wrapAsync = async <T>(promiseOrFn: Promise<T> | (() => Promise<T>)): Promise<T> => {
    startLoading();
    try {
      const result = typeof promiseOrFn === 'function' ? await (promiseOrFn as () => Promise<T>)() : await promiseOrFn;
      setSuccess();
      return result;
    } catch (err) {
      setError();
      throw err;
    }
  };

  if (getCurrentInstance()) {
    onUnmounted(() => {
      clearTimer();
    });
  }

  const stateProps = computed(() => ({
    loading: state.value === 'loading',
    'data-wavelo-state': state.value
  }));

  return {
    state,
    startLoading,
    setSuccess,
    setError,
    reset,
    wrapAsync,
    stateProps
  };
}

export interface UseWaveloProgressOptions {
  /** Initial progress percentage (0-100, default: 0). */
  initial?: number;
  /** Auto-start progress advancement immediately on mount (default: false). */
  autoStart?: boolean;
  /** Simulation mode: 'natural' (exponential creep to 90%), 'linear', or 'manual' (default: 'natural'). */
  mode?: 'natural' | 'linear' | 'manual';
  /** Approximate base duration in ms for 0 to 100% (default: 3000). */
  duration?: number;
  /** Callback fired when value reaches 100%. */
  onComplete?: () => void;
}

export interface UseWaveloProgressReturn {
  /** Reactive current progress percentage (0 to 100). */
  progress: Ref<number>;
  /** Computed formatted percentage string, e.g. "45%". */
  percent: ComputedRef<string>;
  /** Computed true when progress has reached 100%. */
  isComplete: ComputedRef<boolean>;
  /** Starts or resumes simulated progress advancement. */
  start: () => void;
  /** Pauses progress advancement. */
  pause: () => void;
  /** Immediately completes to 100% and triggers onComplete. */
  finish: () => void;
  /** Resets progress back to initial. */
  reset: (newInitial?: number) => void;
  /** Programmatically sets a specific progress value or updater function. */
  setProgress: (val: number | ((prev: number) => number)) => void;
}

/**
 * Smart progress tracker supporting naturalistic network creeping (exponential easing
 * up to ~90% while waiting for async response), linear progress, and manual byte setting.
 */
export function useWaveloProgress(options: UseWaveloProgressOptions = {}): UseWaveloProgressReturn {
  const { initial = 0, autoStart = false, mode = 'natural', duration = 3000, onComplete } = options;
  const progress = ref<number>(Math.max(0, Math.min(100, initial)));
  let isRunning = autoStart;
  let timer: ReturnType<typeof setInterval> | null = null;

  const clearTimer = () => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };

  const finish = () => {
    clearTimer();
    isRunning = false;
    progress.value = 100;
    onComplete?.();
  };

  const startTick = () => {
    if (timer !== null || !isRunning || mode === 'manual' || progress.value >= 100) return;
    const intervalMs = 50;
    timer = setInterval(() => {
      if (progress.value >= 100) {
        clearTimer();
        isRunning = false;
        onComplete?.();
        return;
      }
      if (mode === 'linear') {
        const step = 100 / (duration / intervalMs);
        const next = Math.min(100, progress.value + step);
        progress.value = Math.round(next * 10) / 10;
        if (progress.value >= 100) {
          clearTimer();
          isRunning = false;
          onComplete?.();
        }
      } else {
        // Natural exponential decay creep
        if (progress.value < 90) {
          const remaining = 90 - progress.value;
          const step = Math.max(0.2, (remaining / (duration / intervalMs)) * 1.5);
          progress.value = Math.min(90, Math.round((progress.value + step) * 10) / 10);
        } else {
          progress.value = Math.min(98, Math.round((progress.value + 0.05) * 10) / 10);
        }
      }
    }, intervalMs);
  };

  const start = () => {
    isRunning = true;
    startTick();
  };

  const pause = () => {
    isRunning = false;
    clearTimer();
  };

  const reset = (newInitial: number = initial) => {
    clearTimer();
    isRunning = false;
    progress.value = Math.max(0, Math.min(100, newInitial));
  };

  const setProgress = (val: number | ((prev: number) => number)) => {
    const next = typeof val === 'function' ? val(progress.value) : val;
    const clamped = Math.max(0, Math.min(100, next));
    const prev = progress.value;
    progress.value = clamped;
    if (clamped >= 100 && prev < 100) {
      clearTimer();
      isRunning = false;
      onComplete?.();
    }
  };

  if (autoStart) {
    start();
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      clearTimer();
    });
  }

  return {
    progress,
    percent: computed(() => `${Math.round(progress.value)}%`),
    isComplete: computed(() => progress.value >= 100),
    start,
    pause,
    finish,
    reset,
    setProgress
  };
}

