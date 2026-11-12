import { useState } from 'react';
import { Loader } from '@wavelo/react';

// `inline` puts the box on the text line and sizes it from the font, so the sentence it
// belongs to does not move. A decorative loader carries no label: the status it stands
// for is already in the text next to it, and a second announcement is noise.
export function InlineLoader() {
  const [saving, setSaving] = useState(true);
  return (
    <p className="prose">
      Draft
      <button className="link" onClick={() => setSaving((value) => !value)}>
        {saving ? 'stop autosave' : 'autosave'}
      </button>
      {saving ? (
        <>
          saving
          <Loader type="three-dots" inline size="1em" decorative />
        </>
      ) : (
        <> saved</>
      )}
    </p>
  );
}
