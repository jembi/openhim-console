import theme from '@jembi/openhim-theme'
import Box from '@mui/material/Box'
import {ThemeProvider} from '@mui/material/styles'
import OpenhimAppBar from './components/openhim.appbar.component'
import {ConfirmationProvider} from './contexts/confirmation.context'

export default function Root() {
  return (
    <ThemeProvider theme={theme}>
      <ConfirmationProvider>
        <Box>
          <OpenhimAppBar />
        </Box>
      </ConfirmationProvider>
    </ThemeProvider>
  )
}
