import {ThemeProvider} from '@emotion/react'
import {Box} from '@mui/material'
import {green} from '@mui/material/colors'
import {createTheme} from '@mui/material/styles'
import {useState, useEffect} from 'react'
import OpenHIMMenu from './menu.component'

const theme = createTheme({
  typography: {
    // Tell MUI what's the font-size on the html element is.
    // This is necessary as the legacy angular app uses bootstrap which
    // changes the html font-size globally to 10px
    htmlFontSize: 10
  },
  palette: {
    primary: {
      main: green[700]
    },
    secondary: {
      main: green['A100']
    }
  }
})

export default function Root(props) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{display: {xs: 'none', sm: 'block'}, 'min-width': '200px'}}>
        <OpenHIMMenu></OpenHIMMenu>
      </Box>
    </ThemeProvider>
  )
}
