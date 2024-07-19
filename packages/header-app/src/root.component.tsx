import theme from '@jembi/openhim-theme'
import Box from '@mui/material/Box'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import OpenhimAppBar from './components/openhim.appbar.component'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {green} from '@mui/material/colors'

// const customTheme = createTheme({
//   // ...theme,
//   typography: {
//     // Tell MUI what's the font-size on the html element is.
//     // This is necessary as the legacy angular app uses bootstrap which
//     // changes the html font-size globally to 10px
//     htmlFontSize: 2,
//     fontSize: 2
//   },
//   palette: {
//     primary: {
//       main: green[700]
//     },
//     secondary: {
//       main: green['A100']
//     }
//   }
// })

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
