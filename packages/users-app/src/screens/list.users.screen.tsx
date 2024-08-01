import AddIcon from '@mui/icons-material/Add'
import Search from '@mui/icons-material/Search'
import Edit from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography
} from '@mui/material'
import debounce from '@mui/material/utils/debounce'
import {useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {getUsers} from '../services/api'
import {User, Routes} from '../types'

function UsersList() {
  const [search, setSearch] = React.useState('')
  const navigate = useNavigate()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const {isLoading, isError, data, error, refetch} = useQuery({
    queryKey: ['query.UsersList'],
    queryFn: getUsers,
    enabled: false
  })
  const users = data || []

  React.useEffect(() => {
    refetch()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <div>{error}</div>
  }

  const handleRowClick = (user: User) => {
    navigate(Routes.EDIT_USER, {state: user})
  }

  const handleOnSearchChange = debounce((value: string) => {
    setSearch(value)
  }, 500)

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // @FIXME: Once the search API is implemented, this should be updated to use the filtered roles
  const filteredUsers = users.filter(user => {
    const name = user.firstname.toLowerCase()
    const surname = user.surname.toLowerCase()
    const email = user.email.toLowerCase()
    // const organisation = user.organisation.toLowerCase()

    return (
      name.includes(search.toLowerCase()) ||
      surname.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    )
  })

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
      <Typography variant="h4" gutterBottom>
        Manager Users
      </Typography>

      <Grid container>
        <Grid item xs={11}>
          <Typography variant="subtitle1" gutterBottom>
            View and manage OpenHIM users, add new users and assign them
            specific roles to ensure appropriate access and functionality.
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(Routes.CREATE_USER)}
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
                placeholder="Search..."
                onChange={e => handleOnSearchChange(e.target.value)}
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
                    {/* <TableSortLabel direction="asc">Name</TableSortLabel> */}
                    Name
                  </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {user.firstname} {user.surname}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.groups.join(', ')}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleRowClick(user)}
                          aria-label={`Edit user ${user.firstname} ${user.surname}`}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="section"
            count={filteredUsers.length}
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

export default UsersList
