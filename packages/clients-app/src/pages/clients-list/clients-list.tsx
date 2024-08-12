import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import {Client} from '../../types'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridToolbar
} from '@mui/x-data-grid'
import {FC, useEffect, useState} from 'react'
import {fetchClients, deleteClient} from '@jembi/openhim-core-api'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {BasicInfoModel} from '../../interfaces'
import './data-grid-styling.css'
import {useSnackbar} from 'notistack'
import {AxiosError} from 'axios'

interface ClientsListProps {
  addClient: () => void
  editClient: (id: BasicInfoModel) => void
}

const ClientsList: FC<ClientsListProps> = ({addClient, editClient}) => {
  const [clients, setClients] = useState<Client[]>([])
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  useEffect(() => {
    //@ts-ignore
    fetchClients()
      .then(clients => {
        //@ts-ignore
        clients.forEach(client => {
          setClients(prevClients => [...prevClients, client])
        })
      })
      .catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          enqueueSnackbar(error.response.data, {variant: 'error'})
        } else {
          console.log(JSON.stringify(error))
          enqueueSnackbar('Error fetching clients', {variant: 'error'})
        }
      })
  }, [])

  const [clientToDelete, setClientToDelete] = useState<string | null>(null)
  const handleClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e.currentTarget.id === 'confirm') {
      deleteClient(clientToDelete)
        .then(() => {})
        .catch((error: any) => {
          console.error(error)
        })
      const newClients = clients.filter(
        client => client['_id'] !== clientToDelete
      )
      setClients(newClients)
    }
    setClientToDelete(null)
  }

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
      width: 70,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<CreateIcon />}
          id="edit"
          label="Edit"
          key="edit"
          onClick={() => {
            editClient(params.row as BasicInfoModel)
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          id="delete"
          label="Delete"
          key="delete"
          onClick={() => {
            setClientToDelete(params.row['_id'])
          }}
        />
      ]
    }
  ]

  const CustomNoRowsOverlay = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}
      >
        <Typography variant="h6" color="black" gutterBottom>
          No Clients Available
        </Typography>
        <Button startIcon={<AddIcon />} onClick={addClient} />
      </div>
    )
  }

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

      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontSize={'32px'} fontWeight={400}>
            Client List
          </Typography>
          <Grid container>
            <Grid item xs={11}>
              <p style={{opacity: 0.6, fontSize: '16px'}}>
                Control client systems and their access roles. Add clients to
                enable their request routing and group them by roles for
                streamlined channel access management
              </p>
            </Grid>
            <Grid item xs={1}>
              <Button
                style={{backgroundColor: '#29AC96'}}
                variant="contained"
                onClick={addClient}
              >
                <AddIcon /> Add
              </Button>
            </Grid>
          </Grid>

          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              checkboxSelection
              disableRowSelectionOnClick
              getRowId={row => row.clientID}
              rows={clients}
              columns={columns}
              slots={{toolbar: GridToolbar, noRowsOverlay: CustomNoRowsOverlay}}
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
        </Grid>
      </Grid>
    </>
  )
}

export default ClientsList
