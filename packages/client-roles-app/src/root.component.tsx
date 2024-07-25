import {SnackbarProvider} from 'notistack'
import {StrictMode, useState} from 'react'
import {ListRoles} from './pages/list-client-roles/list-client-roles'
import {ClientRoleForm} from './pages/client-role-form/client-role-form'
import { ClientRole } from './interface'
import "./app.css";

export default function Root(props) {
  const defaultPage = 'list-roles'
  const [activePage, setActivePage] = useState<
    'list-roles' | 'client-role-form'
  >(defaultPage)
  const [existingClientRole, setExistingClientRole] = useState<ClientRole>();

  const returnToListRoles = () => {
    setActivePage('list-roles')
  }
  const addUserRole = () => {
    setActivePage('client-role-form')
  }
  
  const editUserRole = (clientRole: ClientRole) => {
    setExistingClientRole(clientRole);
    setActivePage('client-role-form')
  }

  return (
    <StrictMode>
      <SnackbarProvider maxSnack={3} preventDuplicate>
        {activePage === 'list-roles' && (
          <ListRoles addUserRole={addUserRole} editUserRole={editUserRole} />
        )}
        {activePage === 'client-role-form' && (
          <ClientRoleForm returnToRolesList={returnToListRoles} existingClientRole={existingClientRole}/>
        )}
      </SnackbarProvider>
    </StrictMode>
  )
}
