import {createHashRouter} from 'react-router-dom'
import ManageChannelsScreen from '../screens/manage.channels.screen'
import AddChannelScreen from '../screens/add.channel.screen'
import EditChannelScreen from '../screens/edit.channel.screen'
import {Routes} from '../types'

const router = createHashRouter([
  {
    path: Routes.MANAGE_CHANNELS,
    element: <ManageChannelsScreen />
  },
  {
    path: Routes.CREATE_CHANNEL,
    element: <AddChannelScreen />
  },
  {
    path: Routes.EDIT_CHANNEL,
    element: <EditChannelScreen />
  }
])

export default router
