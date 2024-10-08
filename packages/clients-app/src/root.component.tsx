import {StrictMode, useState} from 'react'
import {createHashRouter, RouterProvider} from 'react-router-dom'

import {AddClient} from './pages/add-client/add-client'
import ClientsList from './pages/clients-list/clients-list'
import EditClient, {
  loader as EditClientLoader
} from './pages/edit-client/edit-client'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import {SnackbarProvider} from 'notistack'

export default function Root(props) {
  const router = createHashRouter([
    {
      path: '!/clients',
      element: <ClientsList />
    },
    {
      path: '!/clients/add',
      element: <AddClient />
    },
    {
      path: '!/clients/edit/:clientId',
      loader: EditClientLoader,
      element: <EditClient />
    }
  ])

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <RouterProvider router={router} />
        </SnackbarProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
