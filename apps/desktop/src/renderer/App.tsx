import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from './components/ui/alert-dialog'
import { Toaster } from 'sonner'
import { createPortal } from 'react-dom'
import { AppShell } from './app/AppShell'
import { useRendererViewModel } from './app/useRendererViewModel'
import { LibraryTab } from './features/library/LibraryTab'
import { SettingsTab } from './features/settings/SettingsTab'
import { WorkspaceTab } from './features/workspace/WorkspaceTab'

export default function App() {
  const viewModel = useRendererViewModel()
  const toaster =
    typeof document !== 'undefined'
      ? createPortal(
          <Toaster
            className="global-toaster"
            richColors
            position="top-right"
            theme={viewModel.toaster.theme}
            offset={{ top: 14, right: 14 }}
            mobileOffset={{ top: 10, left: 10, right: 10 }}
          />,
          document.body
        )
      : null

  return (
    <>
      <AppShell {...viewModel.shell}>
        {viewModel.shell.activeTab === 'library' && <LibraryTab {...viewModel.library} />}
        {viewModel.shell.activeTab === 'workspace' && <WorkspaceTab {...viewModel.workspace} />}
        {viewModel.shell.activeTab === 'settings' && <SettingsTab {...viewModel.settings} />}

        <AlertDialog
          open={viewModel.dialogs.projectPendingDelete !== null}
          onOpenChange={(open) => {
            if (!open) {
              viewModel.dialogs.onCloseDeleteDialog()
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{viewModel.dialogs.text.deleteFromLibrary}</AlertDialogTitle>
              <AlertDialogDescription>
                {viewModel.dialogs.text.confirmDeleteProject}
                {viewModel.dialogs.projectPendingDelete ? ' ' + viewModel.dialogs.projectPendingDelete.name : ''}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={viewModel.dialogs.isDeletingProject}>{viewModel.dialogs.text.no}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={viewModel.dialogs.isDeletingProject || !viewModel.dialogs.projectPendingDelete}
                onClick={() => {
                  void viewModel.dialogs.onConfirmDeleteProject()
                }}
              >
                {viewModel.dialogs.isDeletingProject ? viewModel.dialogs.text.saving : viewModel.dialogs.text.deleteFromLibrary}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AppShell>
      {toaster}
    </>
  )
}
