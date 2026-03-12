import { AppRouter, useDeferredRegistrations, useIsBootstrapping, useProtectedDataQueries } from '@squide/firefly';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { WorkspaceProvider, type SgWorkspace } from './WorkspaceContext';
export interface DeferredRegistrationData {
    workspaceId?: string;
}

function BootstrappingRoute() {
    const [currentWorkspace, setCurrentWorkspace] = useState<SgWorkspace | null>(null);

    const [workspaces,] = useProtectedDataQueries(
        [
            {
                queryKey: ["workspaces"],
                queryFn: () =>
                    ([
                        {id: "workspace-1", name: "Workspace 1"},
                        {id: "workspace-2", name: "Workspace 2"},
                        {id: "workspace-3", name: "Workspace 3"}
                    ])
            },
             // Adding this makes the deferredRegistration work
            // {
            //     queryKey: ["workspaceDetails", currentWorkspace?.id],
            //     gcTime: 0,
            //     queryFn: () => {
            //         return {}
            //     }
            // }
        ],
        () => false
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentWorkspace(workspaces?.[0] || null);
    }, [workspaces]);

    const data: DeferredRegistrationData = useMemo(() => {
        console.log("DeferredRegistrations: usememo setting the workspaceId", currentWorkspace?.id);
        return {
            workspaceId: currentWorkspace?.id
        };
    }, [currentWorkspace]);

    useDeferredRegistrations(data);

  if (useIsBootstrapping()) {
    return <div>Loading...</div>;
  }

  return (
        <WorkspaceProvider value={{
            changeWorkspace: setCurrentWorkspace,
            workspaces: workspaces || [],
            currentWorkspace
        }}>
            <Outlet />
        </WorkspaceProvider>
    );
}

export function App() {
  return (
    <AppRouter>
      {({ rootRoute, registeredRoutes, routerProviderProps }) => {
        return (
          <RouterProvider
            router={createBrowserRouter([
              {
                element: rootRoute,
                children: [
                  {
                    element: <BootstrappingRoute />,
                    children: registeredRoutes,
                  },
                ],
              },
            ])}
            {...routerProviderProps}
          />
        );
      }}
    </AppRouter>
  );
}
