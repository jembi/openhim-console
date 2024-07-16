import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Input,
  Typography,
  Grid,
  Divider,
  InputAdornment
} from '@mui/material'
import {debounce} from '@mui/material/utils'
import Search from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import {Permission, Role} from '../types'
import {Link, useLoaderData, useNavigate} from 'react-router-dom'
import {mapPermissionToHumanReadable} from '../utils'
import {Routes} from '../types'
import {useQuery} from '@tanstack/react-query'
import {getRoles} from '../services/api'
import Loader from '../components/helpers/loader.component'

function UserRoleList() {
  const search = React.useState('')
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const {isLoading, isError, data, error, refetch} = useQuery({
    queryKey: ['query.UserRoleList'],
    queryFn: getRoles,
    enabled: false
  })
  const roles = data || []
  // const delayedFetch = React.useMemo(() => debounce(refetch, 500), [refetch])

  React.useEffect(() => {
    refetch()
  }, [])

  React.useEffect(() => {
    // refetch()
  }, [search])

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <div>{error}</div>
  }

  const handleRowClick = (role: Role) => {
    navigate(Routes.EDIT_ROLE, { state: role })
  }

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

  return (
    <Box padding={3} sx={{backgroundColor: '#fff'}}>
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(Routes.CREATE_ROLE)}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />

      <Card elevation={4}>
        <CardContent>
          <Grid container>
            <Grid item xs={2}>
              <Input
                placeholder="Search"
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
              />
            </Grid>
          </Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel direction="asc">Name</TableSortLabel>
                  </TableCell>
                  <TableCell>Manage</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Additional Permissions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((role, index) => (
                    <TableRow onClick={() => handleRowClick(role)} key={index}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{getManagePermissions(role)}</TableCell>
                      <TableCell>{getViewPermissions(role)}</TableCell>
                      <TableCell>{getAdditionalPermissions(role)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            // rowsPerPageOptions={[5, 10, 25]}

            component="section"
            count={roles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserRoleList
