import { createContext, useContext, type PropsWithChildren } from "react";

export interface SgWorkspace {
    id: string;
    name: string;
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export interface WorkspaceContextType {
    changeWorkspace: (workspace: SgWorkspace) => void;
    workspaces: SgWorkspace[];
    currentWorkspace: SgWorkspace | null;
}

interface WorkspaceProviderProps extends PropsWithChildren {
    value: WorkspaceContextType | null;
}

export function WorkspaceProvider({ children, value }: WorkspaceProviderProps) {
    return (
        <WorkspaceContext.Provider value={value}>
                {children}
        </WorkspaceContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspaceContext() {
    return useContext(WorkspaceContext)!;
}