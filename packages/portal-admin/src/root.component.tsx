import {useEffect, useState} from 'react'
import {ThemeProvider} from '@mui/material/styles'
import Box from '@mui/material/Box'
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {Avatar, Button, Paper, Stack, Switch, Typography} from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import LinearProgress from '@mui/material/LinearProgress'
import './app.css'
import {theme} from './utils/theme'
import {fetchApps} from './utils/api'

function Toolbar() {
  return (
    <section id="apps-toolbar">
      <Typography p={2} variant="h4">
        Manage Apps
      </Typography>
      <Stack direction="row" spacing={2} p={2}>
        <Button disabled variant="contained" color="primary" size="medium">
          Add
        </Button>
        <Button disabled variant="contained" color="primary" size="medium">
          Edit
        </Button>
        <Button disabled variant="contained" color="primary" size="medium">
          Delete
        </Button>
      </Stack>
    </section>
  )
}

export default function PortalAdminRoot(props) {
  const appsInitialState = []
  const [apps, setApps] = useState(appsInitialState)
  useEffect(() => {
    try {
      fetchApps().then(apps => {
        setApps(apps)
      })
    } catch (error) {
      console.error(error)
      setApps(appsInitialState)
    }
  }, [])
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
    }
  ]
  const rows = apps
  return (
    <ThemeProvider theme={theme}>
      <Box p={5} sx={{height: '100%'}}>
        <Paper>
          <section id="apps-datagrid">
            <Box sx={{height: 400, width: '100%'}}>
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
                  toolbar: Toolbar,
                  loadingOverlay: LinearProgress
                }}
                loading={apps.length === 0}
              />
            </Box>
          </section>
        </Paper>
      </Box>
    </ThemeProvider>
  )
}
