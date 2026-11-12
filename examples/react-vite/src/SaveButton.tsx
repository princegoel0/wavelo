import { useState } from 'react';
import { loaderFor } from '@wavelo/react';

// One design, bound with the options it always uses: size for the button's text line,
// and the accessible name a spinner alone never has.
const Spinner = loaderFor('ring', { size: 16, label: 'Saving' });

export function SaveButton() {
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setBusy(false);
  };

  return (
    <button className="button" onClick={save} disabled={busy} aria-busy={busy}>
      {/* `loading={false}` renders nothing at all — no element, no slice — so the slot
          collapses when idle and the label needs no second element to shift back. */}
      <span className="button__slot">
        <Spinner loading={busy} />
      </span>
      {busy ? 'Saving' : 'Save'}
    </button>
  );
}
