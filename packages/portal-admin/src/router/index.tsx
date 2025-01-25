import {createHashRouter} from 'react-router-dom'
import AddAppScreen from '../screens/add.app.screen'
import {Routes} from '../types'
import AppsDataGrid from '../components/AppsDataGrid'

const router = createHashRouter([
  {
    path: Routes.MANAGE_APPS,
    element: <AppsDataGrid />
  },
  {
    path: Routes.CREATE_APP,
    element: <AddAppScreen />
  },
  {
    path: Routes.EDIT_APP,
    element: <AddAppScreen />
  }
])

export default router
