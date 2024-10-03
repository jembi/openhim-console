import {Box, Button, Card, Divider, Grid, Typography} from '@mui/material'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'
import {useEffect, useState} from 'react'
import {fetchClientRoles} from '@jembi/openhim-core-api'

export const ListRoles = () => {
  const addClientRole = new URL(window.origin + '/#!/client-roles/add')

  const columns: GridColDef[] = [
    {field: 'roleName', headerName: 'Name', width: 200},
    {field: 'clients', headerName: 'Clients', width: 600},
    {field: 'channels', headerName: 'Channels', width: 600},
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: () => (
        <>
          <CreateIcon style={{cursor: 'pointer'}} />
        </>
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
          clients: role.clients,
          channels: role.channels
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
    <div style={{minHeight: 'calc(100vh - 119px - 10px)'}}>
      <Grid container padding={2} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontSize={'32px'} fontWeight={400}>
            Manage User Roles
          </Typography>
          <Grid container>
            <Grid item xs={11}>
              <p style={{opacity: 0.6, fontSize: '16px'}}>
                Control client systems and their access roles. Add clients to
                enable their request routing and group them by roles for
                streamlined channel access management.
              </p>
            </Grid>
            <Grid item xs={1}>
              <a href={addClientRole.toString()}>
                <Button
                  variant="contained"
                  style={{backgroundColor: '#29AC96'}}
                >
                  <AddIcon /> Add
                </Button>
              </a>
            </Grid>
          </Grid>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              getRowId={row => row.id}
              autoHeight
              checkboxSelection
              disableRowSelectionOnClick
              rows={roles}
              onRowClick={params =>
                window.history.pushState(
                  {},
                  '',
                  '/#!/client-roles/edit/' + params.row['roleName']
                )
              }
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
    </div>
  )
}
