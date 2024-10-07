import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {ClientRole} from '../../interface'
import {
  Channel,
  Client,
  getAllClientsAndChannels,
  upsertRole
} from '../../utils'
import {AxiosError} from 'axios'
import {useSnackbar} from 'notistack'
import {fetchClientRoles} from '@jembi/openhim-core-api'
import {useLoaderData} from 'react-router-dom'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const defaultClientRoleState: ClientRole = {
  roleName: '',
  clients: [],
  channels: []
}

const pageHeadingTypography = {
  addClientUserRole: {
    heading: 'Add Client Role',
    caption:
      'Control client systems and their access roles. Add client to enable their request routing and group them by roles for streamlined channel access management'
  },
  editClientUserRole: {
    heading: 'Edit Client Role',
    caption:
      'Control client systems and their access roles. Add clients to enable their request routing and group them by roles for streamlined channel access management.'
  }
}

export async function loader({params}) {
  if (params['roleName'] === undefined) {
    return {}
  }

  const allClientRoles = await fetchClientRoles()
  const existingClientRole = allClientRoles.find(
    role => role.roleName === params['roleName']
  )

  return {
    existingClientRole
  }
}

export const ClientRoleForm = () => {
  const {existingClientRole} = useLoaderData() as {
    existingClientRole: ClientRole
  }

  const [clientRole, setClientRole] = useState<ClientRole>({
    ...defaultClientRoleState,
    ...existingClientRole
  })
  const [channelNames, setChannelNames] = useState<string[]>([])
  const [clientNames, setClientNames] = useState<string[]>([])
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  const updateListOfSelectedClientsAndChannels = async () => {
    try {
      const {channels, clients} = await getAllClientsAndChannels()
      clients.forEach(client => {
        if (clientRole.clients.includes(client.clientID)) {
          if (!client.roles.includes(clientRole.roleName)) {
            client.roles.push(clientRole.roleName)
          }
        } else {
          client.roles = client.roles.filter(
            role => role !== clientRole.roleName
          )
        }
      })
      channels.forEach(channel => {
        if (clientRole.channels.includes(channel.name)) {
          if (!channel.allow.includes(clientRole.roleName)) {
            channel.allow.push(clientRole.roleName)
          }
        } else {
          channel.allow = channel.allow.filter(
            role => role !== clientRole.roleName
          )
        }
      })
      await upsertRole(clients, channels)
    } catch (e) {
      const error = e as AxiosError
      if (error.response) {
        console.error(
          'Error updating clients and channels',
          error.response.data
        )
      } else {
        console.error('Error updating clients and channels', error)
      }
      enqueueSnackbar('Error updating clients and channels', {
        variant: 'error'
      })
    }
  }

  useEffect(() => {
    getAllClientsAndChannels()
      .then(({clients, channels}) => {
        setClientNames(clients.map(client => client.clientID))
        setChannelNames(channels.map(channel => channel.name))
      })
      .catch(error => {
        console.error('Error fetching clients and channels', error)
      })
  }, [])

  const handleClientSelectionChange = (
    event: SelectChangeEvent<typeof clientRole.clients>,
    child: any
  ) => {
    const {
      target: {value}
    } = event

    const selectedClients = typeof value === 'string' ? value.split(',') : value
    // what has been added from the client selection of ClientRoles state
    // check the current values of clients against the incoming values and is there are any values that are not presents update the roles of the specific client with the role

    // what has been removed from the client selection of ClientRoles state
    // check the new values of clients against the current values and if there are any values that are not present remove the role from the specific client

    setClientRole(prevClientRole => ({
      ...prevClientRole,
      clients: selectedClients
    }))
  }

  const handleChannelCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setClientRole(prevClientRole => ({
        ...prevClientRole,
        channels: [...prevClientRole.channels, event.target.name]
      }))
    } else {
      setClientRole(prevClientRole => ({
        ...prevClientRole,
        channels: prevClientRole.channels.filter(
          channel => channel !== event.target.name
        )
      }))
    }
  }

  const handleSaveButtonClicked = async () => {
    if (clientRole.roleName === '') {
      enqueueSnackbar('Please enter a role name', {
        variant: 'error'
      })
      return
    }

    if (clientRole.clients.length === 0 || clientRole.channels.length === 0) {
      enqueueSnackbar('Please select at least one client', {
        variant: 'error'
      })
      return
    }
    try {
      await updateListOfSelectedClientsAndChannels()
    } catch (error) {
      console.error('Error updating clients and channels', error)
      enqueueSnackbar('Error updating clients and channels', {
        variant: 'error'
      })
    }
    window.history.pushState({}, '', '/#!/client-roles')
  }

  return (
    <>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontSize={'32px'} fontWeight={400}>
            {existingClientRole
              ? pageHeadingTypography.editClientUserRole.heading
              : pageHeadingTypography.addClientUserRole.heading}
          </Typography>
          <Typography variant="caption" fontSize={16} style={{opacity: 0.6}}>
            {existingClientRole
              ? pageHeadingTypography.editClientUserRole.caption
              : pageHeadingTypography.addClientUserRole.caption}
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{margin: 'auto', maxWidth: 610}}>
            <FormControl sx={{m: 1, width: 580}}>
              <TextField
                id="role-name"
                label="Role Name"
                variant="outlined"
                helperText="Choose a short but descriptive name"
                value={clientRole.roleName}
                onChange={e => {
                  setClientRole(prevClientRole => ({
                    ...prevClientRole,
                    roleName: e.target.value
                  }))
                }}
              />
            </FormControl>
            <FormControl sx={{m: 1, width: 580}}>
              <Typography variant="h5" component="h5">
                Clients
              </Typography>
              <Typography variant="caption">
                Please choose at least one.
              </Typography>
            </FormControl>
            <FormControl sx={{m: 1, width: 580}}>
              <InputLabel id="selected-clients-label">Clients</InputLabel>
              <Select
                id="selected-clients"
                multiple
                value={clientRole.clients}
                onChange={handleClientSelectionChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={selected => (
                  <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                    {selected.map(value => (
                      <Chip key={value} label={value} variant="filled" />
                    ))}
                  </Box>
                )}
              >
                {clientNames.map(name => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Search for clients and select from an autocomplete list
              </FormHelperText>
            </FormControl>

            <FormControl sx={{m: 1, width: 580}}>
              <Typography variant="h5" component="h5">
                Channels
              </Typography>
              <Typography variant="caption">
                Please choose at least one
              </Typography>
              <FormGroup
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 200,
                  overflow: 'auto'
                }}
              >
                {channelNames.map(channel => (
                  <FormControlLabel
                    key={channel}
                    control={
                      <Checkbox
                        name={channel}
                        onChange={handleChannelCheckboxChange}
                        checked={clientRole.channels.includes(channel)}
                      />
                    }
                    label={channel}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <Divider />
            <Box sx={{display: 'flex', justifyContent: 'flex-start', p: 1}}>
              <Button
                onClick={() =>
                  window.history.pushState({}, '', '/#!/client-roles')
                }
                sx={{borderColor: '#29AC96', color: '#29AC96'}}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveButtonClicked}
                sx={{ml: 1, backgroundColor: '#29AC96'}}
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
