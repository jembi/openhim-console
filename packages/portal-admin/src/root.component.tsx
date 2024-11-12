import {ThemeProvider} from '@mui/material/styles'
import {Typography, Box, Paper} from '@mui/material'
import {SnackbarProvider} from 'notistack'
import theme from '@jembi/openhim-theme'
import {FormStateProvider} from './hooks/useFormType'
import AppsDataGrid from '../src/components/AppsDataGrid'

export default function PortalAdminRoot(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <FormStateProvider>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <AppsDataGrid />
        </SnackbarProvider>
      </FormStateProvider>
    </ThemeProvider>
  )
}
