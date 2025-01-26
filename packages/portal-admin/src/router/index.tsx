import {createHashRouter} from 'react-router-dom'
import AddAppScreen from '../screens/add.app.screen'
import EditAppScreen from '../screens/edit.app.screen'
import {Routes} from '../types'
import ListAppsScreen from '../screens/list.apps.screen'

const router = createHashRouter([
  {
    path: Routes.MANAGE_APPS,
    element: <ListAppsScreen />
  },
  {
    path: Routes.CREATE_APP,
    element: <AddAppScreen />
  },
  {
    path: Routes.EDIT_APP,
    element: <EditAppScreen />
  }
])

export default router
