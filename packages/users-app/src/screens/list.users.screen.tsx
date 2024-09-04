import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
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
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid'
import {useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {getUsers} from '../services/api'
import {User, Routes} from '../types'

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
    window.history.pushState({}, '', `/#!/users/edit-user/${user._id}`)
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

  const columns: GridColDef[] = [
    {field: 'firstname', headerName: 'First Name', width: 200},
    {field: 'surname', headerName: 'Surname', width: 200},
    {field: 'email', headerName: 'Email', width: 200},
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

  return (
    <Box padding={3}>
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
            onClick={() =>
              window.history.pushState({}, '', `/#${Routes.CREATE_USER}`)
            }
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />
      <Card elevation={4}>
        <DataGrid
          getRowId={row => row._id}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          columns={columns}
          rows={users}
          onRowClick={params =>
            window.history.pushState(
              {},
              '',
              `/#!/users/edit-user/` + params.row['_id']
            )
          }
          slots={{
            toolbar: GridToolbar,
            noRowsOverlay: noRolesOverlay
          }}
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

export default UsersList
