import { FireflyProvider, initializeFirefly } from '@squide/firefly';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { registerHost } from './register.tsx';

const runtime = initializeFirefly({
  localModules: [registerHost],
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

const root = createRoot(document.getElementById('root')!);

root.render(
  <FireflyProvider runtime={runtime}>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
  </FireflyProvider>
);
