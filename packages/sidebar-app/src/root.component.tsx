import { ThemeProvider } from '@emotion/react'
import { Box } from '@mui/material'
import OpenHIMMenu from './menu.component'
import theme from '@jembi/openhim-theme'

export default function Root(props) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, 'min-width': '200px' }}>
        <OpenHIMMenu></OpenHIMMenu>
      </Box>
    </ThemeProvider>
  )
}
