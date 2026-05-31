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
import { LibraryPage } from './features/library/LibraryPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { WorkspacePage } from './features/workspace/WorkspacePage'

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

  const { activePage } = viewModel.shell

  return (
    <>
      <AppShell {...viewModel.shell}>
        {activePage === 'library' && <LibraryPage {...viewModel.library} />}
        {activePage === 'workspace' && (
          <WorkspacePage
            {...viewModel.workspace}
            runProviderModels={viewModel.settings.runProviderModels}
            onSetTranslationForm={(patch) =>
              viewModel.settings.onSetTranslationForm((prev) => ({ ...prev, ...patch }))
            }
          />
        )}
        {activePage === 'settings' && <SettingsPage {...viewModel.settings} />}

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
