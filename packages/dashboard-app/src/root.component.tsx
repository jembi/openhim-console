import React from 'react'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import Charts from './components/charts.component'

export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <div
          style={{
            marginTop: '16px',
            backgroundColor: '#F1F1F1',
           minHeight: 'calc(100vh - 64px - 10px)'
          }}
        >
          <Charts />
        </div>
      </ThemeProvider>
    </React.StrictMode>
  )
}
