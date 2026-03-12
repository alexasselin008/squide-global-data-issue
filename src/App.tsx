import { AppRouter, useDeferredRegistrations, useIsBootstrapping, useProtectedDataQueries } from '@squide/firefly';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { WorkspaceProvider, type SgWorkspace } from './WorkspaceContext';
export interface DeferredRegistrationData {
    workspaceId?: string;
}


function useCurrentWorkspace(workspaces: SgWorkspace[]) {
    const defaultWorkspace = workspaces.length > 0 ? workspaces[0]: null;
    const [currentWorkspace, setCurrentWorkspace] = useState<SgWorkspace | null>(defaultWorkspace);

    const changeWorkspace = useCallback((workspace: SgWorkspace) => {
        if (currentWorkspace?.id !== workspace.id) {
            setCurrentWorkspace(workspace);
        }
    }, [currentWorkspace?.id]);

    useEffect(() => {
        // Sync when workspace from url/local storage changes
        setCurrentWorkspace(defaultWorkspace);
    }, [defaultWorkspace]);

    return useMemo(() => ({ currentWorkspace, changeWorkspace }), [currentWorkspace, changeWorkspace]);
}

function BootstrappingRoute() {
    const [workspaces, setWorkspaces] = useState<SgWorkspace[]>([]);
    const { currentWorkspace, changeWorkspace } = useCurrentWorkspace(workspaces);

    const [workspacesResponse] = useProtectedDataQueries(
        [
            {
                // queryKey: ["workspaces", currentWorkspace?.id], Adding this makes the deferredRegistration work
                queryKey: ["workspaces"],
                queryFn: () =>
                    ([
                        {id: "workspace-1", name: "Workspace 1"},
                        {id: "workspace-2", name: "Workspace 2"},
                        {id: "workspace-3", name: "Workspace 3"}
                    ])
            }
        ],
        () => false
    );

    useEffect(() => {
        if (workspacesResponse) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWorkspaces(workspacesResponse);
        }
    }, [workspacesResponse]);


    const data: DeferredRegistrationData   = useMemo(() => {
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
            changeWorkspace,
            workspaces,
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
