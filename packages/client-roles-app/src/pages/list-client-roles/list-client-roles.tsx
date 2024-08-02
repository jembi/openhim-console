import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import CreateIcon from '@mui/icons-material/Create'
import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'
import React, {useEffect, useState} from 'react'
import {ClientRole} from '../../interface'
import './data-grid-styling.css'
import {fetchClientRoles} from '@jembi/openhim-core-api'

interface ListRolesProps {
  addUserRole: () => void
  editUserRole: (client: ClientRole) => void
}

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
      .catch(error => {})
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
      <Button onClick={addUserRole} startIcon={<AddIcon />}>Add</Button>
    </div>
  )

  return (
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
            <Button
              variant="contained"
              style={{backgroundColor: '#29AC96'}}
              onClick={addUserRole}
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
            getRowId={row => row.id}
            autoHeight
            checkboxSelection
            disableRowSelectionOnClick
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
