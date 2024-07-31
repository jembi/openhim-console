import {createMemoryRouter} from 'react-router-dom'
import AddUser from '../screens/create.user.component'
import UsersList from '../screens/list.users.screen'
import EditUser from '../screens/edit.user.component'
import {Routes} from '../types'

const router = createMemoryRouter([
  {
    path: Routes.USERS,
    element: <UsersList />
  },
  {
    path: Routes.CREATE_USER,
    element: <AddUser />
  },
  {
    path: Routes.EDIT_USER,
    element: <EditUser />
  }
])

export default router
