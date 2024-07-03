import {Box, Button, Card, Divider, Stack} from '@mui/material'
import {Client} from '../../types'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import {FC, useEffect, useState} from 'react'
import {fetchClients} from '@jembi/openhim-core-api'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add';
import { BasicInfoModel } from '../../interfaces'

interface ClientsListProps {
  addClient: () => void
  editClient: (id: BasicInfoModel) => void
}

const ClientsList: FC<ClientsListProps> = ({addClient, editClient}) => {
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
        <CreateIcon
          style={{cursor: 'pointer'}}
          onClick={() => {
            editClient(params.row as BasicInfoModel)
          }}
        />
      )
    }
  ]

  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    fetchClients().then(clients => {
      clients.forEach(client => {
        setClients(prevClients => [...prevClients, client])
      })
    })
  }, [])

  return (
    <Box sx={{maxWidth: '85%', paddingLeft: 20}}>
      <h1>Clients List</h1>
      <Stack direction="row" spacing={75}>
        <p>
          Control client systems and their access roles. Add clients to enable
          their request routing and group them by roles for streamlined channel
          access management
        </p>
        <Button color="success" variant="contained" onClick={addClient}>
          <AddIcon /> Add
        </Button>
      </Stack>
      <br />
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
  )
}

export default ClientsList
