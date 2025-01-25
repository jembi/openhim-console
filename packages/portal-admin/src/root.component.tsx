import {ThemeProvider} from '@mui/material/styles'
import {Typography, Box, Paper} from '@mui/material'
import {SnackbarProvider} from 'notistack'
import theme from '@jembi/openhim-theme'
import {FormStateProvider} from './hooks/useFormType'
import AppsDataGrid from '../src/components/AppsDataGrid'
import {RouterProvider} from 'react-router-dom'
import router from './router'
import {AlertProvider} from './contexts/alert.context'
import {BasicBackdropProvider} from './contexts/backdrop.context'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {BasicDialogProvider} from './contexts/dialog.context'

export default function PortalAdminRoot(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <FormStateProvider>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <AlertProvider>
            <BasicBackdropProvider>
              <ConfirmationProvider>
                <BasicDialogProvider>
                  <RouterProvider router={router} />
                </BasicDialogProvider>
              </ConfirmationProvider>
            </BasicBackdropProvider>
          </AlertProvider>
        </SnackbarProvider>
      </FormStateProvider>
    </ThemeProvider>
  )
}
