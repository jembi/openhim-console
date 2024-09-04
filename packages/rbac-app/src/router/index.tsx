import {createHashRouter, createMemoryRouter} from 'react-router-dom'
import AddUserRole from '../screens/create.role.component'
import UserRoleList from '../screens/list.role.screen'
import {Routes} from '../types'
import EditUserRole, {
  loader as EditUserRoleLoader
} from '../screens/edit.role.component'

const router = createHashRouter([
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
    element: <EditUserRole />,
    loader: EditUserRoleLoader
  }
])

export default router
