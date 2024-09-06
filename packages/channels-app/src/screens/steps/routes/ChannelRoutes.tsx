import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {makeStyles} from '@mui/styles'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Channel, ChannelRoute, Routes} from '../../../types'
import {ChannelRoute as ChannelRouteComponent} from './ChannelRoute'
import {useBasicDialog} from '../../../contexts/dialog.context'
import {useConfirmation} from '../../../contexts/confirmation.context'

export function ChannelRoutes(props: {
  channel: Channel
  onChange: (event: {channel: Channel; isValid: boolean}) => unknown
}) {
  const {showBasicDialog, hideBasicDialog} = useBasicDialog()
  const {showConfirmation, hideConfirmation} = useConfirmation()
  const navigate = useNavigate()
  const [channel, setChannel] = React.useState(props.channel)

  const handleAddRoute = ({
    route,
    isValid
  }: {
    route: ChannelRoute
    isValid: boolean
  }) => {
    if (isValid) {
      setChannel({
        ...channel,
        routes: [...(channel.routes ?? []), route]
      })
      hideBasicDialog()
    }
  }

  const handleEditRoute = ({
    route,
    isValid
  }: {
    route: ChannelRoute
    isValid: boolean
  }) => {
    if (isValid) {
      for (let i = 0; i < channel.routes?.length; i++) {
        if (channel.routes[i].name === route.name) {
          channel.routes[i] = route

          setChannel(structuredClone(channel))
          hideBasicDialog()
          return
        }
      }

      console.error('[-] Could not find route to update.')
    }
  }

  const onClickAddNewRoute = () => {
    showBasicDialog(
      <ChannelRouteComponent
        onChange={handleAddRoute}
        onCancel={hideBasicDialog}
      />,
      undefined,
      'sm'
    )
  }

  const onClickEditRoute = (route: ChannelRoute) => () => {
    showBasicDialog(
      <ChannelRouteComponent
        route={route}
        onChange={handleEditRoute}
        onCancel={hideBasicDialog}
      />,
      undefined,
      'sm'
    )
  }

  const handleDeleteRoute = (route: ChannelRoute) => () => {
    showConfirmation(
      'Are you sure you want to delete this route?',
      'Delete Route',
      () => {
        setChannel(
          structuredClone({
            ...channel,
            routes: channel.routes?.filter(r => r.name !== route.name)
          })
        )
        hideConfirmation()
      },
      hideConfirmation
    )
  }

  React.useEffect(() => {
    props.onChange({
      channel: structuredClone(channel),
      isValid: channel.routes?.length > 0
    })
  }, [channel])

  return (
    <Box>
      <Typography variant="h5">Routes</Typography>
      <Typography variant="subtitle1">
        Add or modify routes to this channel. Any requests that match this
        channel will be forwarded to each route in the channel. One route can be
        marked as a primary route. The response from the primary route will be
        the one that is returned to the request sender.
      </Typography>

      <Divider
        style={{
          marginTop: '10px',
          margin: '0px',
          width: '100%',
          marginBottom: '10px',
          overflow: 'visible'
        }}
      />

      {channel.routes?.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Host | Port</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Path</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.channel.routes?.map((route, index) => (
                <TableRow key={index}>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>{route.type}</TableCell>
                  <TableCell>{`${route.host ?? '-'} : ${
                    route.port ?? '-'
                  }`}</TableCell>
                  <TableCell>
                    {route.status === 'enabled' ? (
                      <Chip label="enabled" color="success" />
                    ) : (
                      <Chip label="disabled" color="error" />
                    )}
                  </TableCell>
                  <TableCell>{route.path ?? '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={onClickEditRoute(route)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDeleteRoute(route)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          style={{
            padding: '20px',
            textAlign: 'center',
            color: '#999',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
          }}
        >
          <InfoOutlinedIcon
            style={{fontSize: '48px', marginBottom: '10px', color: '#999'}}
          />
          <Typography variant="body1">
            No routes have been added yet. Click{' '}
            <Button variant="text" color="primary" onClick={onClickAddNewRoute}>
              Add New Route
            </Button>{' '}
            to start.
          </Typography>
        </Box>
      )}

      {channel.routes?.length > 0 && (
        <Grid container style={{padding: '10px'}}>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Button variant="text" color="primary" onClick={onClickAddNewRoute}>
              Add New Route
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
