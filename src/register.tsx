import {
  PublicRoutes,
  ProtectedRoutes,
  type ModuleRegisterFunction,
  type FireflyRuntime,
} from '@squide/firefly';
import { HomePage } from './HomePage.tsx';
import { RootLayout } from './RootLayout.tsx';
import { http, HttpResponse } from 'msw';

export const registerHost: ModuleRegisterFunction<FireflyRuntime> = (
  runtime
) => {
  runtime.registerRoute(
    {
      // Pathless route to declare a root layout.
      element: <RootLayout />,
      children: [
        // Placeholders indicating where non hoisted or nested public and protected routes will be rendered.
        PublicRoutes,
        ProtectedRoutes,
      ],
    },
    {
      hoist: true,
    }
  );

  runtime.registerRequestHandlers([
    http.get('/api/me', () => HttpResponse.json({ name: 'John Smith' })),
  ]);

  runtime.registerRoute({
    index: true,
    async loader() {
      await wait(0); // If we add a delay here, everything works fine.
      const response = await fetch("/api/me");
      return response.json();
    },
    element: <HomePage />,
  });
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
