import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import ManageChannelsScreen from './screens/manage.channels.screen'
import React from 'react'
import theme from '@jembi/openhim-theme'
import {ThemeProvider} from '@mui/material'
import {AlertProvider} from './contexts/alert.context'
import {BasicBackdropProvider} from './contexts/backdrop.context'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {BasicDialogProvider} from './contexts/dialog.context'

const queryClient = new QueryClient()

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BasicDialogProvider>
            <BasicBackdropProvider>
              <AlertProvider>
                <ConfirmationProvider>
                  <ManageChannelsScreen />
                </ConfirmationProvider>
              </AlertProvider>
            </BasicBackdropProvider>
          </BasicDialogProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
