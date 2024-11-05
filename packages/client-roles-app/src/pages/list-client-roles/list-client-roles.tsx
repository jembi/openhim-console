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
import {BaseDataGrid, BasePageTemplate} from '../../../../base-components'

export const ListRoles = () => {
  const addClientRole = new URL(window.origin + '/#!/client-roles/add')

  const columns: GridColDef[] = [
    {field: 'roleName', headerName: 'Name', flex: 0.5},
    {field: 'clients', headerName: 'Clients', flex: 0.65},
    {field: 'channels', headerName: 'Channels', flex: 1},
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.1,
      renderCell: () => (
        <div
          style={{
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
    <>
      <BasePageTemplate
        title="Manage Client Roles"
        subtitle="Control client systems and their access roles. Add clients to enable their request routing and group them by roles for streamlined channel access management."
        button={
          <a href={addClientRole.toString()}>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add
            </Button>
          </a>
        }
      >
        <BaseDataGrid
          rows={roles}
          columns={columns}
          getRowId={row => row.id}
          noRowsOverlay={noRolesOverlay}
          onRowClick={params =>
            window.history.pushState(
              {},
              '',
              '/#!/client-roles/edit/' + params.row['roleName']
            )
          }
        />
      </BasePageTemplate>
    </>
  )
}
