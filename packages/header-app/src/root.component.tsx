import theme from '@jembi/openhim-theme'
import Box from '@mui/material/Box'
import {ThemeProvider} from '@emotion/react'
import OpenhimAppBar from './components/openhim.appbar.component'
import {ConfirmationProvider} from './contexts/confirmation.context'
import './header-styles.css'

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
