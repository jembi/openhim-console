import { createMemoryRouter } from 'react-router-dom'
import AddUserRole from '../screens/create.role.component'
import UserRoleList from '../screens/list.role.screen'
import { Routes } from '../types'
import EditUserRole from '../screens/edit.role.component'

const router = createMemoryRouter([
  {
    path: Routes.ROLES,
    element: <UserRoleList />
  },
  {
    path: Routes.CREATE_ROLE,
    element: <AddUserRole />
  },
  {
    path: Routes.EDIT_ROLE,
    element: <EditUserRole />
  }
])

export default router
