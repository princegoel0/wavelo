import { Loader } from '@wavelo/react';

// The App Router renders this while a route is suspending. It is a Server Component, and
// it needs no directive of its own: the boundary is declared inside the package, on the
// module that defines Loader.
export default function Loading() {
  return (
    <>
      <Loader type="progress-top" label="Loading page" />
      <Loader type="skeleton-feed" count={3} label="Loading stories" />
    </>
  );
}
