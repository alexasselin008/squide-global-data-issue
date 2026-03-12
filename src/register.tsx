import {
    ProtectedRoutes,
    PublicRoutes,
    type FireflyRuntime,
    type ModuleRegisterFunction,
} from '@squide/firefly';
import type { DeferredRegistrationData } from './App.tsx';
import { HomePage } from './HomePage.tsx';
import { RootLayout } from './RootLayout.tsx';

export const registerHost: ModuleRegisterFunction<FireflyRuntime, unknown, DeferredRegistrationData> = (
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

  runtime.registerRoute({
    index: true,
    element: <HomePage />,
  });

  return (deferredRuntime, context) => {
        console.log("DeferredRegistrations: registerHost reacting to changes", context.workspaceId);
  }
};
