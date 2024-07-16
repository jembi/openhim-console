import React from 'react'
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';
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
            height: '100vh'
          }}
        >
          <Charts />
        </div>
      </ThemeProvider>
    </React.StrictMode>
  )
}
