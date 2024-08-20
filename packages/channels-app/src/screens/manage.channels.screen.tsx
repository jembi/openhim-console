import AddIcon from '@mui/icons-material/Add'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import ViewIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {useConfirmation} from '../contexts/confirmation.context'
import {getChannels, modifyChannel} from '../services/api'
import {Channel, Routes} from '../types'
import {ErrorMessage} from '../components/helpers/error.component'

const useStyles = makeStyles(_theme => ({
  actionsIcon: {
    marginRight: '10px'
  }
}))

const ManageChannelsScreen: React.FC = () => {
  const navigate = useNavigate()
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
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0)

  const handleOpenContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    channel: Channel
  ) => {
    setAnchorEl(event.currentTarget)
    setSelectedChannel(channel)
  }

  const handleCloseContextMenu = () => {
    setAnchorEl(null)
    setSelectedChannel(null)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const onActionDisableChannel = (channel: Channel) => {
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
      navigate(Routes.EDIT_CHANNEL, {state: selectedChannel})
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
            <a href="?">How do channels work?</a>
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(Routes.CREATE_CHANNEL)}
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
                fullWidth
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </Grid>
          </Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>Channel Name</TableCell>
                  <TableCell>URL Pattern</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Access</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {channels.map((channel, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>{channel.name}</TableCell>
                    <TableCell>{channel.urlPattern}</TableCell>
                    <TableCell>
                      {channel.status === 'enabled' ? (
                        <Chip label="enabled" color="success" />
                      ) : (
                        <Chip label="disabled" color="error" />
                      )}
                    </TableCell>
                    <TableCell>{channel.priority ?? '-'}</TableCell>
                    <TableCell>{channel.allow.join(', ')}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={event => handleOpenContextMenu(event, channel)}
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
                        <MenuItem
                          onClick={() =>
                            onActionDisableChannel(selectedChannel!)
                          }
                        >
                          <CancelIcon className={classes.actionsIcon} />
                          Toggle Status
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="section"
            count={channels.length}
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

export default ManageChannelsScreen
