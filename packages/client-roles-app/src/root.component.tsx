import {SnackbarProvider} from 'notistack'
import {StrictMode, useEffect, useState} from 'react'
import {ThemeProvider} from '@emotion/react'
import {ListRoles} from './pages/list-client-roles/list-client-roles'
import {ClientRoleForm} from './pages/client-role-form/client-role-form'
import {ClientRole} from './interface'
import theme from '@jembi/openhim-theme'
import './app.css'

export default function Root(props) {
  useEffect(() => {
    const handleLocationChange = () => {
      const url = window.location.toString()
      if (url.includes('add') || url.includes('edit')) {
        setActivePage('client-role-form')
        return
      }
      setActivePage('list-roles')
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])
  const defaultPage = window.location.toString().includes('add') ? 'client-role-form' : 'list-roles';

  const [activePage, setActivePage] = useState<
    'list-roles' | 'client-role-form'
  >(defaultPage)
  const [existingClientRole, setExistingClientRole] = useState<ClientRole>()

  const returnToListRoles = () => {
    window.history.pushState({}, '', '/#!/client-roles')
  }
  const addUserRole = () => {
    window.history.pushState({}, '', '/#!/client-roles/add')
  }

  const editUserRole = (clientRole: ClientRole) => {
    setExistingClientRole(clientRole)
    window.history.pushState({}, '', '/#!/client-roles/edit')
  }

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <div
            style={{
              marginTop: '16px',
              backgroundColor: '#F1F1F1',
              height: '100vh',
              width: '100%'
            }}
          >
            {activePage === 'list-roles' && (
              <ListRoles
                addUserRole={addUserRole}
                editUserRole={editUserRole}
              />
            )}
            {activePage === 'client-role-form' && (
              <ClientRoleForm
                returnToRolesList={returnToListRoles}
                existingClientRole={existingClientRole}
              />
            )}
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
