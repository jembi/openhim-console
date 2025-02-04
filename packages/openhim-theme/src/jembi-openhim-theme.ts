import {createTheme} from '@mui/material'
import {green} from '@mui/material/colors'

const overrides = createTheme({
  palette: {
    primary: {
      main: '#049D84'
    },
    secondary: {
      main: green['A100']
    }
  },
  typography: {
    // Tell MUI what's the font-size on the html element is.
    // This is necessary as the legacy angular app uses bootstrap which
    // changes the html font-size globally to 10px
    fontSize: 14
  }
})

export default overrides
