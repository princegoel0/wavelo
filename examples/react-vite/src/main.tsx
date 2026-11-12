import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WaveloProvider } from '@wavelo/react';
import { App } from './App';
import './styles.css';

// No stylesheet import in a client-rendered app: the first loader injects the slice it
// needs, and every later loader that wants the same slice shares the element. The sheet
// is for pages rendered on a server, where no effect runs.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* House style once, so the call sites below say only what changed. A value passed
        to a loader always wins over the provider. */}
    <WaveloProvider defaults={{ color: '#6366f1', size: 24, reducedMotion: 'auto' }}>
      <App />
    </WaveloProvider>
  </StrictMode>
);
