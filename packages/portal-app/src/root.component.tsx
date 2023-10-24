import React from 'react'
import Portal from './components/Portal/Portal'
import {ThemeProvider} from '@emotion/react'
import theme from './utils/theme'

export default function PortalRootApp(props) {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <React.StrictMode>
          <Portal />
        </React.StrictMode>
      </ThemeProvider>
    </div>
  )
}
