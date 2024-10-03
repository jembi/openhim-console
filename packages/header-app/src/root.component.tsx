//import theme from '@jembi/openhim-theme'
import Box from '@mui/material/Box'
import {ThemeProvider} from '@emotion/react'
import OpenhimAppBar from './components/openhim.appbar.component'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {AlertProvider} from './contexts/alert.context'

export default function Root() {
  return (
    <ConfirmationProvider>
      <AlertProvider>
        <Box>
          <OpenhimAppBar />
        </Box>
      </AlertProvider>
    </ConfirmationProvider>
  )
}
