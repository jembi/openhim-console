import React from 'react'
import {useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridColDef,
  GridRowParams
} from '@mui/x-data-grid'
import {Avatar, Switch} from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import DeleteIcon from '@mui/icons-material/Delete'
import LinearProgress from '@mui/material/LinearProgress'
import {useSnackbar} from 'notistack'
import {getAllApps, deleteApp} from '@jembi/openhim-core-api'
import {Toolbar} from './Toolbar'

const AppsDataGrid = () => {
  const appsInitialState = []
  const [apps, setApps] = useState(appsInitialState)
  const [loading, setLoading] = useState(true)
  const [refreshData, setRefreshData] = useState(false)
  const {enqueueSnackbar} = useSnackbar()
  const handleRefresh = () => {
    setRefreshData(prevRefreshData => !prevRefreshData)
  }

  async function loadContent() {
    try {
      setLoading(true)
      await getAllApps().then(apps => {
        setApps(apps)
      })
    } catch (error) {
      enqueueSnackbar('Unable to fetch Apps', {variant: 'error'})
      setApps(appsInitialState)
    } finally {
      setLoading(false)
      setRefreshData(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [refreshData])

  const handleDelete = React.useCallback(
    (itemId: GridRowId) => async () => {
      try {
        await deleteApp(itemId)
        setApps(prevRows => prevRows.filter(row => row._id !== itemId))
        enqueueSnackbar('App was deleted successfully', {variant: 'success'})
      } catch (error) {
        console.error(error)
        enqueueSnackbar('Unable to delete App', {variant: 'error'})
      }
    },
    []
  )

  const columns: GridColDef[] = [
    {field: '_id', headerName: 'ID'},
    {
      field: 'icon',
      headerName: 'Icon',
      type: 'string',
      align: 'center',
      renderCell: params => (
        <Avatar
          variant="rounded"
          aria-label="application icon"
          alt="application icon"
          src={params.value}
          sx={{backgroundColor: 'gray', width: 32, height: 32}}
        >
          <ImageNotSupportedIcon />
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
      valueOptions: ['embedded', 'link']
    },
    {
      field: 'url',
      headerName: 'URL'
    },
    {
      field: 'showInPortal',
      headerName: 'Show In Portal',
      editable: true,
      type: 'boolean',
      renderCell: params => (
        <Switch
          disabled
          checked={params.value}
          onChange={() => {
            // handle switch toggle
          }}
          name="showInPortal"
          inputProps={{'aria-label': 'Show In Side Bar'}}
        />
      )
    },
    {
      field: 'showInSideBar',
      headerName: 'Show In Side Bar',
      editable: true,
      type: 'boolean',
      renderCell: params => (
        <Switch
          disabled
          checked={params.value}
          onChange={() => {
            // handle switch toggle
          }}
          name="showInSideBar"
          inputProps={{'aria-label': 'Show In Side Bar'}}
        />
      )
    },
    {
      field: 'access_roles',
      headerName: 'Access Roles',
      type: 'singleSelect',
      valueOptions: ['admin', 'user']
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={handleDelete(params.row._id)}
          label="Delete"
        />
      ]
    }
  ]
  const rows = apps

  return (
    <section id="apps-datagrid">
      <Box sx={{height: 600, width: '100%'}}>
        <DataGrid
          autoPageSize
          getRowId={(row: any) => row._id}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: () => <Toolbar handleRefresh={handleRefresh} />,
            loadingOverlay: LinearProgress
          }}
          loading={loading}
        />
      </Box>
    </section>
  )
}

export default AppsDataGrid
