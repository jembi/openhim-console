import {Box, Button, Card, Divider, Grid, Stack, Typography} from '@mui/material'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'
import React from 'react'
import {ClientRole} from '../../interface'
import './data-grid-styling.css';

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
    {field: 'clients', headerName: 'Clients', width: 600},
    {field: 'channels', headerName: 'Channels', width: 600},
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
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
      id: '1',
      roleName: 'Hapi Fhir',
      clients: ['instant-client'],
      channels: ['fhir', 'kafka', 'dhis2']
    },
    {
      id: '2',
      roleName: 'Instant',
      clients: ['Contacts'],
      channels: ['fhir']
    },
    {
      id: '3',
      roleName: 'Guest',
      clients: [],
      channels: []
    }
  ]
  return (
    <Grid container padding={2} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" fontSize={'32px'} fontWeight={400}>Manage User Roles</Typography>
        <Grid container>
          <Grid item xs={11}>
            <Typography variant="caption" fontSize={16} style={{opacity: 0.6}}>
              Control client systems and their access roles. Add clients to
              enable their request routing and group them by roles for
              streamlined channel access management.
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained" style={{backgroundColor: '#29AC96'}} onClick={addUserRole}>
              Add
            </Button>
          </Grid>
        </Grid>
        <Divider />
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  )
}
