import {StrictMode, useState} from 'react'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import { Channels } from './components/channels'
import { EditAdd } from './components/editAdd'

export default function Root() {
  const [display, setDisplay] = useState('list')

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        {
          display === 'list' &&
          <Channels setDisplay={setDisplay}/>
        }
        {
          display === 'add' &&
          <EditAdd setDisplay={setDisplay}/>
        }
      </ThemeProvider>
    </StrictMode>
  )
}
