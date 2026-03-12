import { useWorkspaceContext } from "./WorkspaceContext";

export function HomePage() {
    const {changeWorkspace, currentWorkspace, workspaces}  = useWorkspaceContext();
    const handleSwitchWorkspace = () => {
        console.log('Switching workspace...');
        const currentIndex = workspaces.findIndex(w => w.id === currentWorkspace?.id);
        const nextIndex = (currentIndex + 1) % workspaces.length;
        const nextWorkspace = workspaces[nextIndex];

        changeWorkspace(nextWorkspace)
    }

  return <div>Hello from the Home page. <button onClick={handleSwitchWorkspace}>Switch Workspace</button></div>;
}
