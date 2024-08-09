import {StrictMode, useState} from 'react'
import {AddClient} from './pages/add-client/add-client'
import ClientsList from './pages/clients-list/clients-list'
import EditClient from './pages/edit-client/edit-client'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import {Client} from './types'
import {BasicInfoModel} from './interfaces'
import {SnackbarProvider} from 'notistack'

export default function Root(props) {
  const defaultPage = window.location.toString().includes('add') ? 'add-client' : 'client-list';
  
  const [activePage, setActivePage] = useState<
    'client-list' | 'edit-client' | 'add-client'
  >(defaultPage)
  const [activeClient, setActiveClient] = useState<BasicInfoModel | null>(null)
  const returnToClientList = () => {
    setActivePage('client-list')
    window.history.pushState({}, '', '/#!/clients')
    setActiveClient(null)
  }
  const editClient = (client: BasicInfoModel) => {
    setActivePage('edit-client')
    setActiveClient(client)
    window.history.pushState({}, '', '/#!/clients/edit')
  }
  const addClient = () => {
    setActivePage('add-client')
    window.history.pushState({}, '', '/#!/clients/add')
  }

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} preventDuplicate>
          <div
          style={{
            marginTop: '16px',
            backgroundColor: '#F1F1F1',
            height: '100vh'
          }}>
            {activePage === 'client-list' && (
              <ClientsList addClient={addClient} editClient={editClient} />
            )}
            {activePage === 'edit-client' && (
              <EditClient
                client={activeClient}
                returnToClientList={returnToClientList}
              />
            )}
            {activePage === 'add-client' && (
              <AddClient returnToClientList={returnToClientList} />
            )}
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </StrictMode>
  )
}
