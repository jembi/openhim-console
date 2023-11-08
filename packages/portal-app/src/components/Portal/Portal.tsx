import PortalHome from '../PortalHome/PortalHome'
import {SnackbarProvider} from 'notistack'

const Portal = () => {
  return (
    <SnackbarProvider maxSnack={3} preventDuplicate>
      <PortalHome />
    </SnackbarProvider>
  )
}

export default Portal
