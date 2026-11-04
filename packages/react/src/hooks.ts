import { useCallback, useEffect, useRef, useState } from 'react';

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
  /** The active micro-interaction state. */
  state: WaveloState;
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
  /** Props ready to spread onto <Wavelo {...stateProps} /> */
  stateProps: {
    loading: boolean;
    'data-wavelo-state': WaveloState;
  };
}

/**
 * Manages the asynchronous lifecycle and micro-interaction morph states
 * ('idle' -> 'loading' -> 'success' | 'error') with auto-revert timers and
 * promise interception.
 */
export function useWaveloState(options: UseWaveloStateOptions = {}): UseWaveloStateReturn {
  const { initial = 'idle', resetTimeout = 1800, onChange } = options;
  const [state, setState] = useState<WaveloState>(initial);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const changeState = useCallback((nextState: WaveloState) => {
    setState(nextState);
    onChange?.(nextState);
  }, [onChange]);

  const reset = useCallback(() => {
    clearTimer();
    changeState('idle');
  }, [clearTimer, changeState]);

  const startLoading = useCallback(() => {
    clearTimer();
    changeState('loading');
  }, [clearTimer, changeState]);

  const setSuccess = useCallback((customTimeout?: number) => {
    clearTimer();
    changeState('success');
    const timeout = customTimeout ?? resetTimeout;
    if (timeout > 0) {
      timerRef.current = setTimeout(() => {
        changeState('idle');
        timerRef.current = null;
      }, timeout);
    }
  }, [clearTimer, changeState, resetTimeout]);

  const setError = useCallback((customTimeout?: number) => {
    clearTimer();
    changeState('error');
    const timeout = customTimeout ?? resetTimeout;
    if (timeout > 0) {
      timerRef.current = setTimeout(() => {
        changeState('idle');
        timerRef.current = null;
      }, timeout);
    }
  }, [clearTimer, changeState, resetTimeout]);

  const wrapAsync = useCallback(async <T>(promiseOrFn: Promise<T> | (() => Promise<T>)): Promise<T> => {
    startLoading();
    try {
      const result = typeof promiseOrFn === 'function' ? await (promiseOrFn as () => Promise<T>)() : await promiseOrFn;
      setSuccess();
      return result;
    } catch (err) {
      setError();
      throw err;
    }
  }, [startLoading, setSuccess, setError]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    state,
    startLoading,
    setSuccess,
    setError,
    reset,
    wrapAsync,
    stateProps: {
      loading: state === 'loading',
      'data-wavelo-state': state
    }
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
  /** Current progress percentage (0 to 100). */
  progress: number;
  /** Formatted percentage string, e.g. "45%". */
  percent: string;
  /** True when progress has reached 100%. */
  isComplete: boolean;
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
  const [progress, setProgressState] = useState<number>(Math.max(0, Math.min(100, initial)));
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const finish = useCallback(() => {
    setIsRunning(false);
    setProgressState(100);
    onCompleteRef.current?.();
  }, []);

  const reset = useCallback((newInitial: number = initial) => {
    setIsRunning(false);
    setProgressState(Math.max(0, Math.min(100, newInitial)));
  }, [initial]);

  const setProgress = useCallback((val: number | ((prev: number) => number)) => {
    setProgressState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      const clamped = Math.max(0, Math.min(100, next));
      if (clamped >= 100 && prev < 100) {
        setIsRunning(false);
        onCompleteRef.current?.();
      }
      return clamped;
    });
  }, []);

  useEffect(() => {
    if (!isRunning || mode === 'manual' || progress >= 100) return;

    const intervalMs = 50;
    const timer = setInterval(() => {
      setProgressState((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsRunning(false);
          onCompleteRef.current?.();
          return 100;
        }

        if (mode === 'linear') {
          const step = (100 / (duration / intervalMs));
          const next = Math.min(100, prev + step);
          if (next >= 100) {
            clearInterval(timer);
            setIsRunning(false);
            onCompleteRef.current?.();
          }
          return Math.round(next * 10) / 10;
        }

        // Natural exponential decay creep: slow down as we approach 90%
        if (prev < 90) {
          const remaining = 90 - prev;
          const step = Math.max(0.2, (remaining / (duration / intervalMs)) * 1.5);
          return Math.min(90, Math.round((prev + step) * 10) / 10);
        }

        // Extremely slow crawl after 90% while waiting for async resolution
        const crawl = 0.05;
        return Math.min(98, Math.round((prev + crawl) * 10) / 10);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, mode, duration, progress]);

  return {
    progress,
    percent: `${Math.round(progress)}%`,
    isComplete: progress >= 100,
    start,
    pause,
    finish,
    reset,
    setProgress
  };
}

