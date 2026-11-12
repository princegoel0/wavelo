import type { Metadata } from 'next';
import '@wavelo/core/styles.css';

export const metadata: Metadata = {
  title: 'Wavelo in the Next.js App Router'
};

// The sheet is imported once, in the root layout, because a server-rendered page cannot
// inject it: the effect that would do it runs in the browser, after the first paint. Every
// loader on every route then has its rules before it is visible.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
