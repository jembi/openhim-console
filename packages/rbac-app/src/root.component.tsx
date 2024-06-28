import React from 'react'
import { ThemeProvider } from '@emotion/react'
import theme from '@jembi/openhim-theme'
import RBAC from './components/rbac.component';

export default function Root(props) {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <RBAC />
      </ThemeProvider>
    </React.StrictMode>
  )
}

