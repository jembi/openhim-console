import {Box, Button, Card} from '@mui/material'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'
import React from 'react'
import { ClientRole } from '../../interface'

interface ListRolesProps {
  addUserRole: () => void
  editUserRole: (client: ClientRole) => void
}

const noRolesOverlay = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}
  >
    <ErrorIcon fontSize="large" color="disabled" />
    <Box sx={{m: 1}}>No Roles Found</Box>
    //TODO: Add a onclick event to the button
    <Button startIcon={<AddIcon />}>Add</Button>
  </div>
)

export const ListRoles: React.FC<ListRolesProps> = ({
  addUserRole,
  editUserRole
}) => {
  const columns: GridColDef[] = [
    {field: 'roleName', headerName: 'Name', width: 200},
    {field: 'clients', headerName: 'Clients', width: 200},
    {field: 'channels', headerName: 'Channels', width: 200},
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      //TODO: Add a onclick event to the button
      renderCell: () => (
        <>
          <CreateIcon style={{cursor: 'pointer'}} />
        </>
      )
    }
  ]
  const roles = [
    {
      id: "1",
      roleName: 'Hapi Fhir',
      clients: ['instant-client'],
      channels: ['fhir', 'kafka', 'dhis2']
    },
    {
      id: "2",
      roleName: 'Instant',
      clients: ['Contacts'],
      channels: ['fhir']
    },
    {
      id: "3",
      roleName: 'Guest',
      clients: [],
      channels: []
    }
  ]
  return (
    <>
      <h1>Manage User Roles</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        saepe fuga iusto autem culpa. Molestiae commodi laboriosam reprehenderit
        saepe explicabo facilis, assumenda
      </p>
      <Button variant="contained" color="primary" onClick={addUserRole}>
        Add
      </Button>
      <Card>
        <DataGrid
          getRowId={row => row.id}
          autoHeight
          rows={roles}
          onRowClick={params => editUserRole(params.row)}
          slots={{
            toolbar: GridToolbar,
            noRowsOverlay: noRolesOverlay
          }}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {page: 0, pageSize: 10}
            }
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: {disableToolbarButton: true},
              csvOptions: {disableToolbarButton: true}
            }
          }}
        />
      </Card>
    </>
  )
}
