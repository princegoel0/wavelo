import { useEffect, useState } from 'react';
import { Loader } from '@wavelo/react';

const posts = [
  { id: 1, title: 'A loader that never moved the text', minutes: 6 },
  { id: 2, title: 'Reduced motion without a second stylesheet', minutes: 4 },
  { id: 3, title: 'Skeletons, and the layout they promise', minutes: 9 }
];

// The skeleton is the shape of the content that will replace it, so nothing jumps when
// the data arrives. `count` repeats the tracks of the design, and `loading` is the only
// prop that changes when the request finishes: the same element renders posts instead of
// placeholders, and the loader leaves.
export function FeedSkeleton() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2400);
    return () => window.clearTimeout(timer);
  }, []);

  if (ready) {
    return (
      <ul className="feed">
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <span className="feed__meta">{post.minutes} min read</span>
          </li>
        ))}
      </ul>
    );
  }

  return <Loader type="skeleton-feed" count={3} loading label="Loading posts" className="feed" />;
}
