import {createMemoryRouter} from 'react-router-dom'
import AddUser from '../screens/create.user.component'
import UsersList from '../screens/list.users.screen'
import {Routes} from '../types'
import EditUser from '../screens/create.user.component'

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
