import React from 'react'
import App from './components/common/app.main.component'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'

export default function TransactionsLogRootApp(props) {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>  
    </React.StrictMode>
  )
}
