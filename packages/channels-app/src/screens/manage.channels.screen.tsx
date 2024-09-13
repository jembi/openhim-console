import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import ViewIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
import {CustomToolbar} from '../components/helpers/custom.toolbar'
import {ErrorMessage} from '../components/helpers/error.component'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {useConfirmation} from '../contexts/confirmation.context'
import {getChannels, modifyChannel} from '../services/api'
import {Channel} from '../types'

const useStyles = makeStyles(_theme => ({
  actionsIcon: {
    marginRight: '10px'
  },
  tableContainer: {
    padding: '0px'
  }
}))

const ManageChannelsScreen: React.FC = () => {
  const classes = useStyles()
  const {
    isLoading,
    data: channels,
    error,
    refetch
  } = useQuery({
    queryKey: ['query.ManageChannelsScreen'],
    queryFn: getChannels
  })
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const {showAlert} = useAlert()
  const mutation = useMutation({
    mutationFn: modifyChannel,
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      refetch()
    },
    onError: (error: any) => {
      console.error(error)
      hideBackdrop()
      showAlert(
        'Error disabling channel. ' + error?.response?.data,
        'Error',
        'error'
      )
    }
  })
  const {showConfirmation} = useConfirmation()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedChannel, setSelectedChannel] = React.useState<Channel | null>(
    null
  )

  const handleOpenContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    channel: Channel
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedChannel(channel)

    console.log('opening context menu Selected Channel:', channel.name)
  }

  const handleCloseContextMenu = () => {
    setAnchorEl(null)
    setSelectedChannel(null)
  }

  const onActionDisableChannel = () => {
    const channel = selectedChannel
    let title = '',
      message = '',
      modifyChannel: Channel

    if (channel.status === 'enabled') {
      title = 'Disable Channel'
      message = 'Are you sure you want to disable this channel?'
      modifyChannel = {...channel, status: 'disabled'}
    } else {
      title = 'Enable Channel'
      message = 'Are you sure you want to enable this channel?'
      modifyChannel = {...channel, status: 'enabled'}
    }

    handleCloseContextMenu()
    showConfirmation(
      message,
      title,
      () => {
        mutation.mutate(modifyChannel)
        handleCloseContextMenu()
      },
      handleCloseContextMenu
    )
  }

  const handleEditChannel = () => {
    if (selectedChannel) {
      window.history.pushState(selectedChannel, '', `/#!/channels/edit-channel`)
    }
  }

  const handleViewChannelMetrics = () => {
    if (selectedChannel) {
      window.location.href = `/#!/channels/${selectedChannel._id}`
    }
  }

  const handleViewChannelLogs = () => {
    window.location.href = `/#!/logs`
  }

  const columns: GridColDef[] = [
    {field: 'name', headerName: 'Channel Name', flex: 1},
    {field: 'urlPattern', headerName: 'URL Pattern', flex: 1},
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      renderCell: params => (
        <Chip
          label={params.value}
          color={params.value === 'enabled' ? 'success' : 'error'}
        />
      )
    },
    {field: 'priority', headerName: 'Priority', flex: 0.5},
    {field: 'allow', headerName: 'Access', flex: 1},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      renderCell: params => (
        <div>
          <IconButton
            onClick={event =>
              handleOpenContextMenu(event, channels[params.row.id])
            }
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseContextMenu}
          >
            <MenuItem onClick={handleEditChannel}>
              <EditIcon className={classes.actionsIcon} />
              Edit Channel
            </MenuItem>
            <MenuItem onClick={handleViewChannelMetrics}>
              <ViewIcon className={classes.actionsIcon} />
              View Metrics
            </MenuItem>
            <MenuItem divider onClick={handleViewChannelLogs}>
              <SearchIcon className={classes.actionsIcon} />
              View Logs
            </MenuItem>
            <MenuItem onClick={onActionDisableChannel}>
              <CancelIcon className={classes.actionsIcon} />
              Toggle Status
            </MenuItem>
          </Menu>
        </div>
      )
    }
  ]

  const rows = channels?.map((channel, index) => ({
    id: index,
    name: channel.name,
    urlPattern: channel.urlPattern,
    status: channel.status,
    priority: channel.priority ?? '',
    allow: channel.allow.join(', ')
  }))

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <ErrorMessage onRetry={refetch} />
  }

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
      <Typography variant="h4" gutterBottom>
        Manage Channels
      </Typography>

      <Grid container>
        <Grid item xs={11}>
          <Typography variant="subtitle1" gutterBottom>
            Setup and control your channels.&nbsp;
            <a href="">How do channels work?</a>
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            href="/#!/channels/create-channel"
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />

      <Paper elevation={4} className={classes.tableContainer}>
        <DataGrid
          disableRowSelectionOnClick
          disableDensitySelector
          density="comfortable"
          loading={isLoading || mutation.isLoading}
          rows={rows ?? []}
          columns={columns}
          disableColumnMenu
          slots={{toolbar: CustomToolbar}}
          slotProps={{
            toolbar: {
              showQuickFilter: true
            }
          }}
          pagination
        />
      </Paper>
    </Box>
  )
}

export default ManageChannelsScreen
