import React from 'react'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import {Footer} from './components/footer.component'

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Footer />
      </ThemeProvider>
    </React.StrictMode>
  )
}
