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
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {ClientRole} from '../../interface'

interface ClientRoleFormProps {
  returnToRolesList: () => void
  existingClientRole?: ClientRole
}

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
    heading: 'Add User Role',
    caption:
      'Control client systems and their access roles. Add client to enable their request routing and group them by roles for streamlined channel access management'
  },
  editClientUserRole: {
    heading: 'Edit User Role',
    caption:
      'Control client systems and their access roles. Add clients to enable their request routing and group them by roles for streamlined channel access management.'
  }
}

export const ClientRoleForm: React.FC<ClientRoleFormProps> = ({
  returnToRolesList,
  existingClientRole
}) => {
  const [clientRole, setClientRole] = useState<ClientRole>({
    ...defaultClientRoleState,
    ...existingClientRole
  })
  const [channels, setChannels] = useState<string[]>([])
  const [clients, setClients] = useState<string[]>([])

  useEffect(() => {
    // fetch channels
    setChannels(['fhir', 'kafka', 'dhis2'])
    // fetch roles
    setClients(['UltraCare', 'SmartDigiHealth'])
  }, [])

  const handleClientSelectionChange = (
    event: SelectChangeEvent<typeof clientRole.clients>
  ) => {
    const {
      target: {value}
    } = event
    const selectedClients = typeof value === 'string' ? value.split(',') : value
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

  const handleSaveButtonClicked = () => {
    returnToRolesList()
  }

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12}>
        <Typography variant="h3" component="h3">
          {existingClientRole ? pageHeadingTypography.editClientUserRole.heading : pageHeadingTypography.addClientUserRole.heading}
        </Typography>
        <Typography variant="caption">
          {existingClientRole ? pageHeadingTypography.editClientUserRole.caption : pageHeadingTypography.addClientUserRole.caption}
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
              {clients.map(name => (
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
              {channels.map(channel => (
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
            <Button onClick={returnToRolesList} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSaveButtonClicked} sx={{ml: 1}} variant="contained">
              Save
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
