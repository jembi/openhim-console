import {SnackbarProvider} from 'notistack'
import {StrictMode, useState} from 'react'
import {ThemeProvider} from '@emotion/react'
import {ListRoles} from './pages/list-client-roles/list-client-roles'
import {
  ClientRoleForm,
  loader as clientFormLoader
} from './pages/client-role-form/client-role-form'
import {ClientRole} from './interface'
import theme from '@jembi/openhim-theme'
import {createHashRouter, RouterProvider} from 'react-router-dom'

export default function Root(props) {
  const router = createHashRouter([
    {
      path: '!/client-roles',
      element: <ListRoles />
    },
    {
      path: '!/client-roles/add',
      element: <ClientRoleForm />,
      loader: clientFormLoader
    },
    {
      path: '!/client-roles/edit/:roleName',
      element: <ClientRoleForm />,
      loader: clientFormLoader
    }
  ])

  const defaultPage = window.location.toString().includes('add')
    ? 'client-role-form'
    : 'list-roles'

  const [activePage, setActivePage] = useState<
    'list-roles' | 'client-role-form'
  >(defaultPage)

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
