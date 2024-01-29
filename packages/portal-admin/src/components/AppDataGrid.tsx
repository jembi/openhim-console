import {useState, useEffect} from 'react'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams
} from '@mui/x-data-grid'
import {
  Avatar,
  Box,
  Checkbox,
  LinearProgress,
  Stack,
  styled,
  Button
} from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {enqueueSnackbar} from 'notistack'
import FormDialog from './FormDialog'
import {getAllApps, deleteApp, editApp, addApp} from '@jembi/openhim-core-api'

const AppDataGrid = () => {
  const formInitialState = {
    name: '',
    description: '',
    category: '',
    type: 'link',
    url: '',
    showInPortal: true,
    showInSideBar: false,
    access_roles: ['admin']
  }
  const [apps, setApps] = useState([])
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedApp, setSelectedApp] = useState(formInitialState)
  const [loading, setLoading] = useState(true)

  async function loadContent() {
    try {
      setLoading(true)
      await getAllApps().then(apps => {
        setApps(apps)
      })
    } catch (error) {
      enqueueSnackbar('Unable to fetch Apps', {variant: 'error'})
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const handleApp = async data => {
    if (openEditDialog) {
      handleEditApp(data)
    } else {
      handleAddApp(data)
    }
  }

  const handleAddApp = async data => {
    try {
      data.name = data.name.trim()
      data.description = data.description.trim()
      data.url = data.url.trim()

      await addApp(data)
      enqueueSnackbar('App was registered successfully', {variant: 'success'})
      setOpenDialog(false)
      setSelectedApp(formInitialState)
      loadContent()
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        enqueueSnackbar('App already exists', {variant: 'error'})
      } else {
        enqueueSnackbar('Failed to add app ! ' + error.response.data?.error, {
          variant: 'error'
        })
      }
    }
  }

  const handleEditApp = async data => {
    try {
      await editApp(data._id, data)
      loadContent()
      enqueueSnackbar('App was updated successfully', {variant: 'success'})
      setSelectedApp(formInitialState)
    } catch (error) {
      enqueueSnackbar('Failed to edit app! ' + error.response.data.error, {
        variant: 'error'
      })
      console.error(error)
    } finally {
      setOpenDialog(false)
      setOpenEditDialog(false)
    }
  }

  const handleDeleteApp = async id => {
    try {
      await deleteApp(id)
      loadContent()
      enqueueSnackbar('App was deleted successfully', {variant: 'success'})
    } catch (error) {
      enqueueSnackbar('Failed to delete app', {variant: 'error'})
    }
  }

  const columns: GridColDef[] = [
    {field: '_id', headerName: 'ID'},
    {
      field: 'icon',
      headerName: 'Icon',
      type: 'string',
      align: 'center',
      width: 35,
      renderCell: params => (
        <Avatar
          variant="rounded"
          aria-label="application icon"
          alt="application icon"
          sx={{backgroundColor: 'gray', width: 32, height: 32}}
        >
          {params.value ? (
            <img
              src={params.value}
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
      headerName: 'Application Name'
    },
    {
      field: 'description',
      headerName: 'Description'
    },
    {
      field: 'category',
      headerName: 'Category',
      type: 'singleSelect',
      valueOptions: ['OpenHIM', 'Operations', 'Reports', 'Other']
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: ['internal', 'external', 'esmodule']
    },
    {
      field: 'url',
      headerName: 'URL'
    },
    {
      field: 'access_roles',
      headerName: 'Access Roles',
      type: 'singleSelect',
      valueOptions: ['admin', 'user']
    },
    {
      field: 'showInPortal',
      headerName: 'Show In Portal',
      type: 'boolean',
      renderCell: params => (
        <Checkbox
          disabled
          checked={params.value}
          icon={<VisibilityOffIcon />}
          checkedIcon={<VisibilityIcon />}
          name="showInPortal"
          inputProps={{'aria-label': 'Show In Side Bar'}}
        />
      )
    },
    {
      field: 'showInSideBar',
      headerName: 'Show In Side Bar',
      type: 'boolean',
      renderCell: params => (
        <Checkbox
          disabled
          checked={params.value}
          icon={<VisibilityOffIcon />}
          checkedIcon={<VisibilityIcon />}
          name="showInSideBar"
          inputProps={{'aria-label': 'Show In Side Bar'}}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          id="edit"
          label="Edit"
          onClick={() => {
            setOpenEditDialog(true)
            setOpenDialog(true)
            setSelectedApp(params.row)
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          id="delete"
          label="Delete"
          onClick={() => {
            handleDeleteApp(params.row._id)
          }}
        />
      ]
    }
  ]
  const StyledGridOverlay = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }))
  function CustomNoRowsOverlay() {
    return (
      <>
        <StyledGridOverlay>
          <ErrorIcon fontSize="large" color="disabled" />
          <Box sx={{m: 1}}>No apps found</Box>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true)
              setSelectedApp(formInitialState)
            }}
          >
            Add
          </Button>
        </StyledGridOverlay>
      </>
    )
  }

  return (
    <>
      <Box paddingX={0}>
        <section id="apps-toolbar">
          <Stack direction="row" spacing={2} p={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={loadContent}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
            <Button
              aria-label="add app"
              onClick={() => {
                setOpenDialog(true)
                setSelectedApp(formInitialState)
              }}
              size="small"
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
            >
              ADD
            </Button>
          </Stack>
        </section>
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
          />
        </Box>
      </Box>

      <FormDialog
        edit={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleApp={handleApp}
        selectedApp={selectedApp}
      />
    </>
  )
}

export default AppDataGrid
