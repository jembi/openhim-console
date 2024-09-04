import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import React from 'react'
import theme from '@jembi/openhim-theme'
import {ThemeProvider} from '@emotion/react'
import {AlertProvider} from './contexts/alert.context'
import {BasicBackdropProvider} from './contexts/backdrop.context'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {BasicDialogProvider} from './contexts/dialog.context'
import {RouterProvider} from 'react-router-dom'
import router from './router'

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
                  <RouterProvider router={router} />
                </ConfirmationProvider>
              </AlertProvider>
            </BasicBackdropProvider>
          </BasicDialogProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
