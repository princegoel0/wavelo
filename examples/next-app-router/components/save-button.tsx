'use client';

import { useState } from 'react';
import { loaderFor, useWaveloState } from '@wavelo/react';

// One design for the whole lifecycle, read from the state the hook maintains: idle means
// nothing is shown, loading runs, success and error morph into their own shape, and the
// hook returns to idle on its own after the reset timeout.
const Feedback = loaderFor('button-confirm', { size: 20 });

const label = (state: string) =>
  state === 'success' ? 'Saved' : state === 'error' ? 'Try again' : state === 'loading' ? 'Saving' : 'Save draft';

export function SaveButton() {
  const [saved, setSaved] = useState(0);
  const { state, stateProps, wrapAsync } = useWaveloState({ resetTimeout: 1600 });

  const save = () =>
    wrapAsync(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setSaved((count) => count + 1);
    });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
    >
      <button type="submit" disabled={state === 'loading'} aria-busy={state === 'loading'}>
        {label(state)}
      </button>
      {/* `stateProps` is `loading` plus `data-wavelo-state`; the explicit loading keeps the
          design on screen long enough to finish its success morph. */}
      <Feedback {...stateProps} loading={state !== 'idle'} />
      <span>{saved} saved</span>
    </form>
  );
}
