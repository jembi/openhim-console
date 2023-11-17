import {ThemeProvider} from '@mui/material/styles'
import {Typography, Box} from '@mui/material'
import {SnackbarProvider} from 'notistack'
import {theme} from './utils/theme'
import './app.css'

import AppsDataGrid from './components/AppDataGrid'

export default function PortalAdminRoot(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} preventDuplicate>
          <Typography p={2} variant="h4">
            Manage Apps
          </Typography>
          <AppsDataGrid />
      </SnackbarProvider>
    </ThemeProvider>
  )
}
