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
  Tooltip,
  Typography,
  Checkbox
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

export function ChannelRoutes(props: {
  channel: Channel
  onChange: (event: {channel: Channel; isValid: boolean}) => unknown
}) {
  const {showBasicDialog, hideBasicDialog} = useBasicDialog()
  const {showConfirmation, hideConfirmation} = useConfirmation()
  const navigate = useNavigate()
  const [channel, setChannel] = React.useState(props.channel)
  const [selectAll, setSelectAll] = React.useState(false)
  const [selectedRoutes, setSelectedRoutes] = React.useState<string[]>([])

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
        if (channel.routes[i]._id === route._id) {
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
      'sm',
      {paddingX: 0}
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectAll(event.target.checked)
    if (event.target.checked) {
      setSelectedRoutes(channel.routes?.map(r => r._id) || [])
    } else {
      setSelectedRoutes([])
    }
  }

  const handleSelectRoute = (routeId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRoutes(prev => [...prev, routeId])
    } else {
      setSelectedRoutes(prev => prev.filter(id => id !== routeId))
    }
  }

  React.useEffect(() => {
    props.onChange({
      channel: structuredClone(channel),
      isValid: channel.routes?.length > 0
    })
  }, [channel])

  return (
    <Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="48px">
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  icon={<CheckBoxOutlineBlankIcon />}
                  checkedIcon={<CheckBoxIcon />}
                  sx={{
                    '&.Mui-checked': {
                      color: '#007F68',
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.17px'
              }}>Name</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.17px'
              }}>Type</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.17px'
              }}>Host</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.17px'
              }}>Path</TableCell>
              <TableCell sx={{ 
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.17px'
              }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channel.routes?.length > 0 ? (
              channel.routes.map((route, index) => (
                <TableRow 
                  key={index}
                  sx={{
                    backgroundColor: selectedRoutes.includes(route._id) ? 'rgba(0, 127, 104, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: selectedRoutes.includes(route._id) 
                        ? 'rgba(0, 127, 104, 0.12)' 
                        : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedRoutes.includes(route._id)}
                      onChange={handleSelectRoute(route._id)}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                      sx={{
                        '&.Mui-checked': {
                          color: '#007F68',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {route.name}
                    {route.primary && (
                      <Tooltip title="This route is a Primary Route">
                        <Chip
                          label="primary"
                          sx={{ 
                            bgcolor: '#007F68',
                            color: 'white',
                            marginLeft: '5px'
                          }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={route.type} 
                      variant="outlined"
                      sx={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        borderRadius: '16px'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{route.host}</TableCell>
                  <TableCell>{route.path}</TableCell>
                  <TableCell>
                    <IconButton onClick={onClickEditRoute(route)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDeleteRoute(route)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    sx={{
                      py: 6,
                      textAlign: 'center',
                      color: '#999',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{ fontSize: 48, mb: 1, color: '#999' }}
                    />
                    <Typography variant="body1">
                      No routes have been added yet. Click{' '}
                      <Button 
                        variant="text" 
                        sx={{ color: '#007F68' }} 
                        onClick={onClickAddNewRoute}
                      >
                        Add New Route
                      </Button>{' '}
                      to start.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="text" 
          sx={{ 
            color: '#007F68',
            textTransform: 'uppercase' 
          }}
          onClick={onClickAddNewRoute}
        >
          Add New Route
        </Button>
      </Box>
    </Box>
  )
}
