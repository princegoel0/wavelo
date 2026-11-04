import { renderReactLoader } from '@wavelo/react/server';
import { SaveButton } from '../components/save-button';

// A Server Component. Two shapes are shown side by side:
//
//  * renderReactLoader returns markup and the slice it needs, so the first-paint loader
//    costs no JavaScript at all — it is in the HTML the server sent.
//  * <Loader> from '@wavelo/react' is used by the client component below, where the
//    boundary is already declared inside the package. Neither needs a 'use client'
//    wrapper file.
export default function Page() {
  const shell = renderReactLoader({ type: 'skeleton-feed', count: 3, label: 'Loading stories' });

  return (
    <main style={{ maxWidth: '44rem', margin: '0 auto', padding: '3rem 1.25rem' }}>
      <h1>Wavelo in the App Router</h1>
      <p>
        The placeholder below is markup from the server, styled by the sheet the root layout
        imported. Nothing about it ships a component.
      </p>
      {/* core's own markup, from a literal configuration: every value is escaped or
          rejected by validation before it becomes a string, and nothing here comes from a
          request. Do not do this with a value a user supplied. */}
      <div dangerouslySetInnerHTML={{ __html: shell.html }} />
      <hr />
      <SaveButton />
    </main>
  );
}
