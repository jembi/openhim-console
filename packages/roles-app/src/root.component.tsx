import {SnackbarProvider} from 'notistack'
import {StrictMode, useState} from 'react'
import {ListRoles} from './pages/list-roles/list-roles'
import {AddUserRole} from './pages/add-user-role/add-user-role'
import {EditUserRole} from './pages/edit-user-role/edit-user-role'

export default function Root(props) {
  const defaultPage = 'add-user-role'
  const [activePage, setActivePage] = useState<
    'list-roles' | 'add-user-role' | 'edit-user-role'
  >(defaultPage)

  const returnToListRoles = () => {
    setActivePage('list-roles')
  }
  const addUserRole = () => {
    setActivePage('add-user-role')
  }

  const editUserRole = (id: number) => {
    setActivePage('edit-user-role')
  }

  return (
    <StrictMode>
      <SnackbarProvider maxSnack={3} preventDuplicate>
        {activePage === 'list-roles' && (
          <ListRoles addUserRole={addUserRole} editUserRole={editUserRole} />
        )}
        {activePage === 'add-user-role' && (
          <AddUserRole returnToRolesList={returnToListRoles} />
        )}
        {activePage === 'edit-user-role' && (
          <EditUserRole returnToRolesList={returnToListRoles} />
        )}
      </SnackbarProvider>
    </StrictMode>
  )
}
