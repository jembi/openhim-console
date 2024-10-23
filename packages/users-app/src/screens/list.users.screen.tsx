import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
import ErrorIcon from '@mui/icons-material/Error'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import debounce from '@mui/material/utils/debounce'
import {
  DataGrid,
  GridColDef,
  GridDeleteForeverIcon,
  GridToolbar
} from '@mui/x-data-grid'
import {useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {deleteUserByEmail, getUsers} from '../services/api'
import {User, Routes} from '../types'
import {CustomToolbar} from '../components/helpers/custom.toolbar'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {useAlert} from '../contexts/alert.context'
import {useConfirmation} from '../contexts/confirmation.context'

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
  const {isLoading, isError, data: users, error, refetch} = useQuery({
    queryKey: ['query.UsersList'],
    queryFn: getUsers,
    enabled: false
  })
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const {showConfirmation, hideConfirmation} = useConfirmation()
  const {showAlert} = useAlert()

  React.useEffect(() => {
    refetch()
  }, [])

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <div>{error}</div>
  }

  const onEditUser = (user: User) => {
    window.history.pushState({}, '', `/#!/users/edit-user/` + user._id)
  }

  const onDeleteUser = (user: User) => {
    showConfirmation(
      'Are you sure you want to delete this user?',
      'Delete User',
      () => {
        showBackdrop(<Loader />, true)
        deleteUserByEmail(user.email)
          .then(() => {
            hideBackdrop()
            showAlert('User deleted successfully', 'Success', 'success')
            refetch()
          })
          .catch(error => {
            hideBackdrop()
            showAlert(
              'Error deleting user. ' + error?.response?.data,
              'Error',
              'error'
            )
          })
      }
    )
  }

  const columns: GridColDef[] = [
    {field: 'firstname', headerName: 'First Name', flex: 1},
    {field: 'surname', headerName: 'Surname', flex: 1},
    {field: 'email', headerName: 'Email', flex: 1},
    {
      field: 'groups',
      headerName: 'Roles',
      flex: 1,
      valueGetter: (params: any) => {
        return Array.isArray(params) ? params.join(', ') : ''
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      align: 'right',
      headerAlign: 'right',
      flex: 0.5,
      renderCell: params => (
        <>
          <IconButton onClick={() => onEditUser(params.row)}>
            <CreateIcon />
          </IconButton>
          <IconButton onClick={() => onDeleteUser(params.row)}>
            <GridDeleteForeverIcon />
          </IconButton>
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
      <Card elevation={4} sx={{paddingX: '25px'}}>
        <DataGrid
          getRowId={row => row._id}
          disableRowSelectionOnClick
          disableDensitySelector
          density="comfortable"
          disableMultipleRowSelection
          disableColumnSelector
          disableColumnResize
          disableColumnMenu
          columns={columns}
          slots={{toolbar: CustomToolbar}}
          rows={users}
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
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: 'none'
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: 'none'
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold'
            }
          }}
        />
      </Card>
    </Box>
  )
}

export default UsersList
