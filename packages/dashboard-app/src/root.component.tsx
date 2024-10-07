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
             
          }}
        >
          <Charts />
        </div>
      </ThemeProvider>
    </React.StrictMode>
  )
}
