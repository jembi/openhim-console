import { useState } from 'react';
import { AddClient } from './pages/add-client/add-client'
import ClientsList from './pages/clients-list/clients-list'
import EditClient from './pages/edit-client/edit-client'

export default function Root(props) {
  const [activePage, setActivePage] = useState<"client-list"|"edit-client"|"add-client">("client-list");
  const [clientID, setClientID] = useState<string | null>(null);
  const returnToClientList = () => {
    setActivePage("client-list");
    setClientID(null);
  };
  const editClient = (id: string) => {
    setActivePage("edit-client");
    setClientID(id);
  };
  const addClient = () => {
    setActivePage("add-client");
  };

  return (
    <>
      {activePage === "client-list" && <ClientsList  addClient={addClient} editClient={editClient} />}
      {activePage === "edit-client" && <EditClient clientID={clientID} returnToClientList={returnToClientList}/>}
      {activePage === "add-client" && <AddClient   returnToClientList={returnToClientList} />}
    </>
  )
}
