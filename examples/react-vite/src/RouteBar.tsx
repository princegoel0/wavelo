import { useEffect, useRef, useState } from 'react';
import { createRouteProgress } from '@wavelo/core';

// The bar is one object for the whole app, not a component per route: the router calls
// start() when a navigation begins and done() when the new view is on screen. Between
// them it creeps toward its ceiling, because a slow route is not at 100% yet. This
// example fakes a slow navigation so the wiring is visible; in a real app the calls live
// in the router's own events, next to the code that already knows a route changed.
export function RouteBar() {
  const [page, setPage] = useState(1);
  const bar = useRef<ReturnType<typeof createRouteProgress> | null>(null);

  useEffect(() => {
    const progress = createRouteProgress({ color: '#6366f1' }, { trickle: 200, ceiling: 90, hold: 250 });
    bar.current = progress;
    return () => {
      progress.destroy();
      bar.current = null;
    };
  }, []);

  const navigate = () => {
    bar.current?.start();
    window.setTimeout(() => {
      bar.current?.done();
      setPage((value) => value + 1);
    }, 1500);
  };

  return (
    <button className="button" onClick={navigate}>
      Go to page {page + 1}
    </button>
  );
}
