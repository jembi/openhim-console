import {Box, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Stack} from '@mui/material'
import {Client} from '../../types'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import {FC, useEffect, useState} from 'react'
import {fetchClients, deleteClient} from '@jembi/openhim-core-api'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {BasicInfoModel} from '../../interfaces'
import './data-grid-styling.css'
import {set} from 'zod'
import { useSnackbar } from 'notistack'
import { AxiosError } from 'axios'

interface ClientsListProps {
  addClient: () => void
  editClient: (id: BasicInfoModel) => void
}

const ClientsList: FC<ClientsListProps> = ({addClient, editClient}) => {
  const [clients, setClients] = useState<Client[]>([])
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    //@ts-ignore
    fetchClients().then(clients => {
      //@ts-ignore
      clients.forEach(client => {
        setClients(prevClients => [...prevClients, client])
      })
    }).catch((error: AxiosError) => {
      if(error.response && error.response.data){
        enqueueSnackbar(error.response.data, { variant: 'error' });
      }else{
        console.log(JSON.stringify(error));
        enqueueSnackbar('Error fetching clients', { variant: 'error' });
      }
    });
  }, [])

  const [clientToDelete, setClientToDelete] = useState<string| null>(null);
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
    if (e.currentTarget.id === 'confirm') {      
      deleteClient(clientToDelete).then(() => {}).catch((error: any) => {
        console.error(error)
      });
      const newClients = clients.filter(client => client['_id'] !== clientToDelete);
      setClients(newClients);
    }
    setClientToDelete(null)
  };

  const columns: GridColDef[] = [
    {field: 'clientID', headerName: 'ID', width: 80},
    {field: 'name', headerName: 'Name', width: 95},
    {field: 'organization', headerName: 'Organization', width: 170},
    {field: 'softwareName', headerName: 'Software Name', width: 180},
    {field: 'description', headerName: 'Description', width: 177},
    {field: 'contactPerson', headerName: 'Contact Person', width: 140},
    {field: 'clientDomain', headerName: 'Domain', width: 200},
    {field: 'roles', headerName: 'Roles', width: 200},
    {
      field: 'actions',
      headerName: 'Actions',
      width: 50,
      renderCell: params => (
        <>
          <CreateIcon
            style={{cursor: 'pointer'}}
            onClick={() => {
              editClient(params.row as BasicInfoModel)
            }}
          />
          <DeleteIcon
            style={{cursor: 'pointer'}}
            onClick={() => {
              setClientToDelete(params.row['_id'])
            }}
          />
        </>
      )
    }
  ]

  

  return (
    <>
      <Dialog
        open={!!clientToDelete}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to delete this client?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Warning: This action cannot be undone. Once you delete a client, all
            of its data will be permanently removed from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="confirm" onClick={handleClose}>
            Confirm
          </Button>
          <Button id="cancel" onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* Separation */}
      <Box sx={{maxWidth: '85%', paddingLeft: 20}}>
        <h1>Clients List</h1>
        <Stack direction="row" spacing={32} sx={{marginBottom: 1}}>
          <p style={{opacity: 0.6}}>
            Control client systems and their access roles. Add clients to enable
            their request routing and group them by roles for streamlined
            channel access management
          </p>
          <Button
            style={{backgroundColor: '#29AC96'}}
            variant="contained"
            onClick={addClient}
          >
            <AddIcon /> Add
          </Button>
        </Stack>
        <Divider />
        <br />
        <Card>
          <DataGrid
            getRowId={row => row.clientID}
            rows={clients}
            columns={columns}
            slots={{toolbar: GridToolbar}}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: {disableToolbarButton: true},
                csvOptions: {disableToolbarButton: true}
              }
            }}
            initialState={{
              pagination: {
                paginationModel: {page: 0, pageSize: 10}
              }
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Card>
      </Box>
    </>
  )
}

export default ClientsList
