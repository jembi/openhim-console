import React from 'react'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'
import {AlertProvider} from './contexts/alert.context'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {BasicDialogProvider} from './contexts/dialog.context'
import UserRoleList from './screens/list.role.screen'
import {getRoles} from './services/api'
import AddUserRole from './screens/create.role.component'
import router from './router'

const queryClient = new QueryClient()

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BasicDialogProvider>
            <AlertProvider>
              <ConfirmationProvider>
                <RouterProvider router={router} />
              </ConfirmationProvider>
            </AlertProvider>
          </BasicDialogProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
