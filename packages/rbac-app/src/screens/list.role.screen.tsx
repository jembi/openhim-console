import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import debounce from '@mui/material/utils/debounce'
import {useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {getRoles} from '../services/api'
import {Permission, Role, Routes} from '../types'
import {mapPermissionToHumanReadable} from '../utils'
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'

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
    <Box sx={{m: 1}}>No Users Found</Box>
    <a href="">
      <Button startIcon={<AddIcon />}>Add</Button>
    </a>
  </div>
)

function UserRoleList() {
  const addClientURL = new URL(window.origin + '/#!/rbac/create-role')
  const [search, setSearch] = React.useState('')
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const {isLoading, isError, data, error, refetch} = useQuery({
    queryKey: ['query.UserRoleList'],
    queryFn: getRoles,
    enabled: false
  })
  const roles = data || []

  React.useEffect(() => {
    refetch()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <div>{error}</div>
  }

  const handleRowClick = (role: Role) => {
    window.history.pushState({}, '', `/#!/rbac/edit-role/${role.name}`)
  }

  const handleOnSearchChange = debounce((value: string) => {
    setSearch(value)
  }, 500)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getManagePermissions = (role: Role) => {
    if (!role?.permissions) return ''

    const x = Object.entries(
      mapPermissionToHumanReadable(
        Object.entries(role.permissions)
          .filter(
            ([_key, value]) => typeof value === 'boolean' && value === true
          )
          .reduce(
            (acc, [key, value]) => ({...acc, [key]: value}),
            {} as Permission
          )
      )
    )
      .filter(([_key, value]) => value.includes('Manage'))
      .map(([_key, value]) => value.replace('Manage', ''))
      .join(', ')

    return x
  }

  const getViewPermissions = (role: Role) => {
    if (!role?.permissions) return ''

    const x = Object.entries(
      mapPermissionToHumanReadable(
        Object.entries(role.permissions)
          .filter(
            ([_key, value]) => typeof value === 'boolean' && value === true
          )
          .reduce(
            (acc, [key, value]) => ({...acc, [key]: value}),
            {} as Permission
          )
      )
    )
      .filter(([_key, value]) => value.includes('View'))
      .map(([_key, value]) => value.replace('View', ''))
      .join(', ')

    return x
  }

  const getAdditionalPermissions = (role: Role) => {
    if (!role?.permissions) return ''

    const x = Object.entries(
      mapPermissionToHumanReadable(
        Object.entries(role.permissions)
          .filter(
            ([_key, value]) => typeof value === 'boolean' && value === true
          )
          .reduce(
            (acc, [key, value]) => ({...acc, [key]: value}),
            {} as Permission
          )
      )
    )
      .filter(
        ([_key, value]) => !value.includes('Manage') && !value.includes('View')
      )
      .map(([_key, value]) => value)
      .join(', ')

    return x
  }

  // @FIXME: Once the search API is implemented, this should be updated to use the filtered roles
  const filteredRoles = roles.filter(r => {
    const name = r.name.toLowerCase()

    return name.includes(search.toLowerCase())
  })

  const formattedRoles = filteredRoles.map(role => ({
    _id: role._id,
    name: role.name,
    manage: getManagePermissions(role),
    view: getViewPermissions(role),
    additional: getAdditionalPermissions(role)
  }))

  const columns: GridColDef[] = [
    {field: 'name', headerName: 'Name', width: 100},
    {
      field: 'manage',
      headerName: 'Manage',
      width: 500
    },
    {
      field: 'view',
      headerName: 'View',
      width: 500
    },
    {
      field: 'additional',
      headerName: 'Additional Permissions',
      width: 200
    }
  ]

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
      <Typography variant="h4" gutterBottom>
        User Roles List
      </Typography>

      <Grid container>
        <Grid item xs={11}>
          <Typography variant="subtitle1" gutterBottom>
            Easily assign and manage roles and permissions to users by selecting
            a role, viewing and editing its permissions, or creating a new role
            with customized permissions.
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <a href={addClientURL.toString()}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Add
            </Button>
          </a>
        </Grid>
      </Grid>

      <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />

      <Card elevation={4}>
        <DataGrid
          getRowId={row => row.name}
          columns={columns}
          rows={formattedRoles}
          getRowHeight={() => 'auto'}
          autoHeight
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
            noRowsOverlay: noRolesOverlay
          }}
          onRowClick={params =>
            window.history.pushState(
              {},
              '',
              `/#!/rbac/edit-role/` + params.row['name']
            )
          }
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
    </Box>
  )
}

export default UserRoleList
