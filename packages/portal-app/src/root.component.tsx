import React from 'react'
import Portal from './components/Portal/Portal'
import {ThemeProvider} from '@emotion/react'
import theme from './utils/theme'

export default function PortalRootApp(props) {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Portal />
      </ThemeProvider>
    </React.StrictMode>
  )
}
