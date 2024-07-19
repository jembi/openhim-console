import {Button, Card} from '@mui/material'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import React from 'react'

interface ListRolesProps {
  addUserRole: () => void
  editUserRole: (id: number) => void
}

export const ListRoles: React.FC<ListRolesProps> = ({
  addUserRole,
  editUserRole
}) => {
  const columns: GridColDef[] = [
    {field: 'name', headerName: 'Name', width: 200},
    {field: 'manage', headerName: 'Manage', width: 200},
    {field: 'view', headerName: 'View', width: 200},
    {
      field: 'additionalPermissions',
      headerName: 'Additional Permissions',
      width: 200
    }
  ]
  const roles = [
    {
      id: 1,
      name: 'Admin',
      manage: ['Some Channels', 'All Clients'],
      view: ['All Apps'],
      additionalPermissions: ['Import & Export Data']
    },
    {
      id: 2,
      name: 'User',
      manage: ['Contacts'],
      view: ['All Client'],
      additionalPermissions: ['None']
    },
    {
      id: 3,
      name: 'Guest',
      manage: ['None'],
      view: ['None'],
      additionalPermissions: ['None']
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
          rows={roles}
          onRowClick={params => editUserRole(params.row.id)}
          slots={{toolbar: GridToolbar}}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
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
