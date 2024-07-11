import {StrictMode, useState} from 'react'
import {AddClient} from './pages/add-client/add-client'
import ClientsList from './pages/clients-list/clients-list'
import EditClient from './pages/edit-client/edit-client'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import { Client } from './types'
import { BasicInfoModel } from './interfaces'

export default function Root(props) {
  const defaultPage = "add-client";
  const [activePage, setActivePage] = useState<
    'client-list' | 'edit-client' | 'add-client'
  >(defaultPage)
  const [activeClient, setActiveClient] = useState<BasicInfoModel | null>(null)
  const returnToClientList = () => {
    setActivePage('client-list')
    setActiveClient(null)
  }
  const editClient = (client: BasicInfoModel) => {
    setActivePage('edit-client')
    setActiveClient(client)
  }
  const addClient = () => {
    setActivePage('add-client')
  }

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </StrictMode>
  )
}
