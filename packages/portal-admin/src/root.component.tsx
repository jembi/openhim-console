import {ThemeProvider} from '@mui/material/styles'
import {Typography, Box, Paper} from '@mui/material'
import {SnackbarProvider} from 'notistack'
import theme from '@jembi/openhim-theme'
import './app.css'
import {FormStateProvider} from './hooks/useFormType'

import AppsDataGrid from '../src/components/AppsDataGrid'

export default function PortalAdminRoot(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <FormStateProvider>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <Box p={5}>
            <Paper>
              <Box p={2}>
                <Typography variant="h4">Manage Apps</Typography>
                <Typography variant="body2">
                  Add and update all the Portal apps details and settings
                </Typography>
                <AppsDataGrid />
              </Box>
            </Paper>
          </Box>
        </SnackbarProvider>
      </FormStateProvider>
    </ThemeProvider>
  )
}
