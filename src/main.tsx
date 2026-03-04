import { createRoot } from 'react-dom/client';
import { FireflyProvider, initializeFirefly } from '@squide/firefly';
import { App } from './App.tsx';
import { registerHost } from './register.tsx';

const runtime = initializeFirefly({
  useMsw: true,
  localModules: [registerHost],
  startMsw: async (x) => {
    // Files that includes an import to the "msw" package are included dynamically to prevent adding
    // unused MSW stuff to the code bundles.
    return (await import('./mocks/browser.ts')).startMsw(x.requestHandlers);
  },
});

const root = createRoot(document.getElementById('root')!);

root.render(
  <FireflyProvider runtime={runtime}>
    <App />
  </FireflyProvider>
);
