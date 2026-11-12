import { FeedSkeleton } from './FeedSkeleton';
import { InlineLoader } from './InlineLoader';
import { RouteBar } from './RouteBar';
import { SaveButton } from './SaveButton';

export function App() {
  return (
    <main className="page">
      <RouteBar />
      <h1>Wavelo in a React SPA</h1>
      <p>
        Four patterns, each in the place it normally lives: a button that shows its work
        without resizing, a bar for navigation, a skeleton that holds the shape of the
        content, and a loader sitting on the text line.
      </p>
      <section>
        <SaveButton />
        <InlineLoader />
      </section>
      <FeedSkeleton />
    </main>
  );
}
