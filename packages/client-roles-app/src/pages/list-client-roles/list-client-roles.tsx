import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Paper,
  Typography
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter
} from '@mui/x-data-grid'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'
import {useEffect, useState} from 'react'
import {fetchClientRoles} from '@jembi/openhim-core-api'

const CustomToolbar = () => {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <GridToolbarQuickFilter variant="standard" />
    </div>
  )
}

export const ListRoles = () => {
  const addClientRole = new URL(window.origin + '/#!/client-roles/add')

  const columns: GridColDef[] = [
    {field: 'roleName', headerName: 'Name', flex: 0.5},
    {field: 'clients', headerName: 'Clients', flex: 0.65},
    {field: 'channels', headerName: 'Channels', flex: 1},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      renderCell: () => (
        <div style={{padding:8, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <CreateIcon style={{cursor: 'pointer'}} />
        </div>
      )
    }
  ]

  const [roles, setRoles] = useState([])

  useEffect(() => {
    fetchClientRoles()
      .then(roles => {
        const formattedRoles = roles.map(role => ({
          id: role.roleName,
          roleName: role.roleName,
          clients: role.clients.join(', '),
          channels: role.channels.join(', ')
        }))
        setRoles(formattedRoles)
      })
      .catch(error => {
        console.error('Error fetching client roles', error)
      })
  }, [])

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
      <a href={addClientRole.toString()}>
        <Button startIcon={<AddIcon />}>Add</Button>
      </a>
    </div>
  )

  return (
    <Box padding={1}>
      <Grid container padding={2} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Manage Client Roles
          </Typography>
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
                streamlined channel access management.
              </Typography>
            </Grid>
            <Grid item>
              <a href={addClientRole.toString()}>
                <Button variant="contained">
                  <AddIcon /> Add
                </Button>
              </a>
            </Grid>
          </Grid>
          <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />
        </Grid>
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{paddingX: '15px', borderRadius: '12px', paddingTop: '30px'}}
          >
            <DataGrid
              getRowId={row => row.id}
              autoHeight
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
                '&, [class^=MuiDataGrid]': {border: 'none'},
                '--DataGrid-containerBackground': '#f8f8f8'
              }}
              rows={roles}
              onRowClick={params =>
                window.history.pushState(
                  {},
                  '',
                  '/#!/client-roles/edit/' + params.row['roleName']
                )
              }
              slots={{
                toolbar: CustomToolbar,
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
