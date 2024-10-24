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
  Paper,
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
import {useEffect, useState} from 'react'
import {fetchClients, deleteClient} from '@jembi/openhim-core-api'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import {useSnackbar} from 'notistack'
import {AxiosError} from 'axios'
import { Wrapper } from "../../../../base-components/Wrapper";

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([])
  const {enqueueSnackbar} = useSnackbar()

  const addingClient = new URL(window.origin + '/#!/clients/add')

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

  const columns: GridColDef[] = [
    {field: 'clientID', headerName: 'ID', flex: 1},
    {field: 'name', headerName: 'Name', flex: 1},
    {field: 'organization', headerName: 'Organization', flex: 0.7},
    {field: 'softwareName', headerName: 'Software Name', flex: 0.7},
    {field: 'description', headerName: 'Description', flex: 0.6},
    {field: 'contactPerson', headerName: 'Contact Person', flex: 0.6},
    {field: 'clientDomain', headerName: 'Domain', flex: 0.5},
    {field: 'roles', headerName: 'Roles', flex: 0.6},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.3,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<CreateIcon />}
          id="edit"
          label="Edit"
          key="edit"
          onClick={() => {
            window.history.pushState(
              {client: params.row},
              '',
              `/#!/clients/edit/${params.row['_id']}`
            )
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
        <a href={addingClient.toString()}>
          <Button startIcon={<AddIcon />} />
        </a>
      </div>
    )
  }

  return (
    <Box
      padding={1}
      sx={{
        backgroundColor: '#F1F1F1',
        minHeight: 'calc(100vh - 119px - 10px)'
      }}
    >
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Manage Clients
          </Typography>
          <Wrapper>
            <p>Hello World</p>
          </Wrapper>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Grid item>
              <Typography variant="subtitle1" gutterBottom>
                Control client systems and their access roles. Add clients to
                enable their request routing and group them by roles for
                streamlined channel access management
              </Typography>
            </Grid>
            <Grid item>
              <a href={addingClient.toString()}>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Add
                </Button>
              </a>
            </Grid>
          </Grid>
          <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              checkboxSelection
              disableColumnMenu
              disableRowSelectionOnClick
              density="comfortable"
              getRowId={row => row.clientID}
              rows={clients}
              columns={columns}
              slots={{
                toolbar: GridToolbar,
                noRowsOverlay: CustomNoRowsOverlay
              }}
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
    </Box>
  )
}

export default ClientsList
