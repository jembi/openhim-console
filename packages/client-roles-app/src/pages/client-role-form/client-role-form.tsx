import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {ClientRole} from '../../interface'
import {
  getAllClientsAndChannels,
  upsertRole
} from '../../utils'
import {AxiosError} from 'axios'
import {useSnackbar} from 'notistack'
import {fetchClientRoles} from '@jembi/openhim-core-api'
import {useLoaderData} from 'react-router-dom'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const defaultClientRoleState: ClientRole = {
  roleName: '',
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
      const {channels} = await getAllClientsAndChannels()
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
      await upsertRole(channels)
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

    if (clientRole.channels.length === 0) {
      enqueueSnackbar('Please select at least one channel', {
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
    <Box padding={1}>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {existingClientRole
              ? pageHeadingTypography.editClientUserRole.heading
              : pageHeadingTypography.addClientUserRole.heading}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {existingClientRole
              ? pageHeadingTypography.editClientUserRole.caption
              : pageHeadingTypography.addClientUserRole.caption}
          </Typography>
          <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined" sx={{margin: 'auto', maxWidth: 610}}>
            <Box sx={{margin: 1}}>
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
                <Typography
                  variant="h5"
                  component="h5"
                  sx={{fontWeight: 'bold'}}
                >
                  Channels
                </Typography>
                <Typography variant="caption">Select one or more</Typography>
                <FormGroup
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                  }}
                >
                  {channelNames.map(channel => (
                    <FormControlLabel
                      sx={{marginLeft: 0.5}}
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
            </Box>

            <Divider />
            <Box sx={{display: 'flex', justifyContent: 'flex-start', p: 1}}>
              <Button
                onClick={() =>
                  window.history.pushState({}, '', '/#!/client-roles')
                }
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveButtonClicked}
                sx={{ml: 1}}
                variant="contained"
              >
                Save
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
