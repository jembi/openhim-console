import {deleteApp, editApp, getAllApps} from '@jembi/openhim-core-api'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import RefreshIcon from '@mui/icons-material/Refresh'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  LinearProgress,
  Paper,
  Stack,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams
} from '@mui/x-data-grid'
import {enqueueSnackbar} from 'notistack'
import {useEffect, useState} from 'react'
import {BasePageTemplate} from '../../../base-components'
import {App} from '../types'
import {useConfirmation} from '../contexts/confirmation.context'
import {useAlert} from '../contexts/alert.context'

const StyledGridOverlay = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%'
}))

const AppsDataGrid = () => {
  const {showAlert} = useAlert()
  const {showConfirmation, hideConfirmation} = useConfirmation()
  const [loading, setLoading] = useState(true)
  //List of apps saved in mongoDB
  const [apps, setApps] = useState([])
  //Selected app in the data grid.
  const [selectedApp, setSelectedApp] = useState()

  const columns: GridColDef[] = [
    {field: '_id', headerName: 'ID', flex: 0.25},
    {
      field: 'icon',
      headerName: 'Icon',
      type: 'string',
      align: 'center',
      width: 35,
      flex: 0.25,
      renderCell: params => (
        <Avatar
          variant="rounded"
          aria-label="application icon"
          alt="application icon"
          sx={{backgroundColor: 'gray', width: 32, height: 32}}
        >
          {params.row.icon ? (
            <img
              src={params.row.icon}
              alt={params.row.name.substring(0, 2)}
              width={24}
            />
          ) : (
            <ImageNotSupportedIcon />
          )}
        </Avatar>
      )
    },
    {
      field: 'name',
      flex: 1,
      headerName: 'Application Name'
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'category',
      headerName: 'Category',
      type: 'singleSelect',
      valueOptions: ['OpenHIM', 'Operations', 'Reports', 'Other'],
      flex: 0.5
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: ['internal', 'external', 'esmodule'],
      flex: 0.5
    },
    {
      field: 'url',
      headerName: 'URL',
      flex: 1
    },
    {
      field: 'access_roles',
      headerName: 'Access Roles',
      type: 'singleSelect',
      valueOptions: ['admin', 'user'],
      flex: 0.5
    },
    {
      field: 'showInPortal',
      headerName: 'Show In Portal',
      type: 'boolean',
      flex: 0.75,
      renderCell: params =>
        (params.row as App).showInPortal ? (
          <VisibilityIcon />
        ) : (
          <VisibilityOffIcon />
        )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          id="edit"
          label="Edit"
          onClick={() => {
            setSelectedApp(params.row)
            handleEditApp(params.row)
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          id="delete"
          label="Delete"
          onClick={() => {
            handleDeleteApp(params.row)
          }}
        />
      ]
    }
  ]

  const CustomNoRowsOverlay = () => {
    return (
      <>
        <StyledGridOverlay sx={{py: 1}}>
          <ErrorIcon fontSize="large" color="disabled" />
          <Box sx={{m: 1}}>No apps found</Box>
          <Button startIcon={<AddIcon />} onClick={handleAddApp}>
            Add
          </Button>
        </StyledGridOverlay>
      </>
    )
  }

  const loadContent = async () => {
    try {
      setLoading(true)
      const apps = await getAllApps()
      const mappings = {
        internal: 'Built-in',
        external: 'Shortcut',
        esmodule: 'Extension'
      }
      const updatedApps = apps.map(app => ({
        ...app,
        type: mappings[app.type]
      }))
      setApps(updatedApps)
    } catch (error) {
      enqueueSnackbar('Unable to fetch Apps', {variant: 'error'})
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddApp = () => {
    window.history.pushState(null, '', `/#!/portal-admin/create-add`)
  }

  const handleDeleteApp = async (app: App) => {
    showConfirmation(
      'Are you sure you want to delete this app?',
      'Delete App',
      () => {
        deleteApp(app._id)
          .then(() => {
            showAlert('App deleted successfully', 'Success', 'success')
            loadContent()
          })
          .catch((error: any) => {
            const err = error?.response?.data ?? 'An unexpected error occurred'
            console.error(error)
            showAlert('Error deleting app. ' + err, 'Error', 'error')
          })
      }
    )
  }

  const handleEditApp = app => {
    window.history.pushState(app, '', `/#!/portal-admin/edit-add`)
  }

  useEffect(() => {
    loadContent()
  }, [])

  return (
    <BasePageTemplate
      title="Manage Apps"
      subtitle="Add and update all the Portal apps details and settings"
      button={
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={loadContent}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
          <Button
            aria-label="add app"
            onClick={handleAddApp}
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
          >
            ADD
          </Button>
        </Stack>
      }
    >
      <Paper sx={{paddingX: 0}}>
        <Box sx={{height: '100%', width: '100%'}}>
          <DataGrid
            columnVisibilityModel={{
              // Hide _id column, the other columns will remain visible
              _id: false
            }}
            getRowId={(row: any) => row._id}
            autoHeight
            rows={apps}
            columns={columns}
            slots={{
              loadingOverlay: LinearProgress,
              noRowsOverlay: CustomNoRowsOverlay
            }}
            loading={loading}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10
                }
              }
            }}
            pageSizeOptions={[10]}
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
        </Box>
      </Paper>
    </BasePageTemplate>
  )
}

export default AppsDataGrid
