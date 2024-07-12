import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {Permission, Role} from '../types'
import {Link, useLoaderData, useNavigate} from 'react-router-dom'
import {mapPermissionToHumanReadable} from '../utils'
import {Routes} from '../types'

function UserRoleList() {
  const navigate = useNavigate()
  const roles = useLoaderData() as Role[]
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

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
            ([_key, value]) => typeof value === 'boolean' && value !== true
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
            ([_key, value]) => typeof value === 'boolean' && value !== true
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
            ([_key, value]) => typeof value === 'boolean' && value !== true
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
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        User Roles List
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Easily assign and manage roles and permissions to users by selecting a
        role, viewing and editing its permissions, or creating a new role with
        customized permissions.
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <TextField variant="outlined" placeholder="Search..." />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate(Routes.CREATE_ROLE)}
        >
          Add
        </Button>
      </Box>
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Manage</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Additional Permissions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((role, index) => (
                    <TableRow key={index}>
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
