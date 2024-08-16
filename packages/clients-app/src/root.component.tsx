import {StrictMode, useState, useEffect} from 'react'
import {AddClient} from './pages/add-client/add-client'
import ClientsList from './pages/clients-list/clients-list'
import EditClient from './pages/edit-client/edit-client'
import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import {BasicInfoModel} from './interfaces'
import {SnackbarProvider} from 'notistack'


export default function Root(props) {
  useEffect(() => {
    const handleLocationChange = () => {
      const url = window.location.toString();
      if(url.includes('add')){
        setActivePage('add-client');
        return;
      }
      else if(url.includes('edit')){
        setActivePage('edit-client');
        return;
      }
      setActivePage('client-list');
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);
  const defaultPage = window.location.toString().includes('add') ? 'add-client' : 'client-list';

  const [activePage, setActivePage] = useState<
    'client-list' | 'edit-client' | 'add-client'
  >(defaultPage)
  const [activeClient, setActiveClient] = useState<BasicInfoModel | null>(null)
  const returnToClientList = () => {
    setActiveClient(null)
    window.history.pushState({}, '', '/#!/clients')
  }
  const editClient = (client: BasicInfoModel) => {
    setActiveClient(client)
    window.history.pushState({}, '', '/#!/clients/edit')
  }
  const addClient = () => {
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
            height: '100vh',
            width: "100%",
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
