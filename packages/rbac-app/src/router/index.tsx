import AddUserRole from '../screens/create.role.component'
import UserRoleList from '../screens/list.role.screen'
import {createMemoryRouter} from 'react-router-dom'
import {
  getApps,
  getChannels,
  getClients,
  getMediators,
  getRoles,
  getTransactions
} from '../services/api'
import {CreateRoleLoader, Routes} from '../types'

const router = createMemoryRouter([
  {
    path: Routes.ROLES,
    element: <UserRoleList />,
    loader: getRoles
  },
  {
    path: Routes.CREATE_ROLE,
    element: <AddUserRole />,
    loader: async (): Promise<CreateRoleLoader> => {
      try {
        const [channels, clients, transactions, mediators, apps] =
          await Promise.all([
            getChannels(),
            getClients(),
            getTransactions(),
            getMediators(),
            getApps()
          ])

        return {channels, clients, transactions, mediators, apps}
      } catch (err) {
        throw err
      }
    }
  }
])

export default router
