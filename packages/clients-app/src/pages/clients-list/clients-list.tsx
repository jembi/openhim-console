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
import {BaseDataGrid, BasePageTemplate} from '../../../../base-components'
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
    <>
    <BasePageTemplate
      title="Manage Clients"
      subtitle="Add clients to enable their request routing and group them by roles for streamlined channel access management."
      button={
        <a href={addingClient.toString()}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add
          </Button>
        </a>
      }
    >
      <BaseDataGrid
        getRowId={row => row.clientID}
        rows={clients}
        columns={columns}
        noRowsOverlay={CustomNoRowsOverlay}
        onRowClick={params =>
          window.history.pushState(
            {},
            '',
            '/#!/clients/edit/' + params.row['_id']
          )
        }
      />
    </BasePageTemplate>
    </>
    
  )
}

export default ClientsList
