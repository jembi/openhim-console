import {SnackbarProvider} from 'notistack'
import {StrictMode, useState} from 'react'
import {ThemeProvider} from '@emotion/react'
import {ListRoles} from './pages/list-client-roles/list-client-roles'
import {ClientRoleForm, loader as clientFormLoader} from './pages/client-role-form/client-role-form'
import {ClientRole} from './interface'
import theme from '@jembi/openhim-theme'
import './app.css'
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
  const [existingClientRole, setExistingClientRole] = useState<ClientRole>()

  const returnToListRoles = () => {
    setActivePage('list-roles')
    window.history.pushState({}, '', '/#!/client-roles')
  }
  const addUserRole = () => {
    setActivePage('client-role-form')
    window.history.pushState({}, '', '/#!/client-roles/add')
  }

  const editUserRole = (clientRole: ClientRole) => {
    setExistingClientRole(clientRole)
    setActivePage('client-role-form')
    window.history.pushState({}, '', '/#!/client-roles/edit/:roleName')
  }

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <div
            style={{
              marginTop: '16px',
              backgroundColor: '#F1F1F1',
              height: '100vh'
            }}
          >
            <RouterProvider router={router} />
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
