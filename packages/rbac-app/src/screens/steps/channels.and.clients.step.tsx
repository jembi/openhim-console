import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import {PermissionChip} from '../../components/helpers/permission.chip.component'
import {InputAdornment} from '../../components/helpers/input.adornment.component'
import {Channel, Client, Permission, Role} from '../../types'

export function ChannelsClientsStep(props: {
  role: Role
  channels: Channel[]
  clients: Client[]
  onChange: (role: Role) => void
}) {
  const [role, setRole] = React.useState(props.role)

  React.useEffect(() => {
    props.onChange(role)
  }, [role])

  const handleSwitchToggle = (
    permission: keyof Permission,
    checked: boolean
  ) => {
    setRole({
      ...role,
      permissions: {
        ...role.permissions,
        [permission]: checked
      }
    })
  }

  const handleSelectChange = (
    permission: keyof Permission,
    value: string | string[]
  ) => {
    const data = typeof value === 'string' ? value.split(',') : value

    setRole({
      ...role,
      permissions: {
        ...role.permissions,
        [permission]: data
      }
    })
  }

  const paperStyling = {padding: '10px 20px'}

  return (
    <Box>
      <Typography variant="h6">
        Set Channels, Clients and Client Roles
      </Typography>
      <Typography variant="subtitle1">
        Manage permissions for viewing and managing channels, clients and client
        roles.
      </Typography>

      <Divider style={{marginTop: '10px', marginBottom: '10px'}} />

      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Paper style={paperStyling}>
            <Typography variant="h5">Role Name</Typography>

            <Grid container>
              <Grid item xs={8}>
                <TextField
                  label="Role Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={role.name}
                  onChange={e => setRole({...role, name: e.target.value})}
                  error={role.name.trim() === ''}
                  helperText={
                    role.name.trim() === ''
                      ? 'Role name cannot be empty'
                      : undefined
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Channels</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['channel-manage-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'channel-manage-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow channel management"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="channel-manage-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    labelId="channel-manage-specified"
                    multiple
                    variant="outlined"
                    value={role.permissions['channel-manage-specified']}
                    disabled={!role.permissions['channel-manage-all']}
                    onChange={e =>
                      handleSelectChange(
                        'channel-manage-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.channels.map(channel => (
                      <MenuItem value={channel.name}>{channel.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['channel-view-all']}
                      onChange={e =>
                        handleSwitchToggle('channel-view-all', e.target.checked)
                      }
                    />
                  }
                  label="Allow channel viewing"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="channel-view-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    multiple
                    labelId="channel-view-specified"
                    label="Choose options"
                    variant="outlined"
                    value={role.permissions['channel-view-specified']}
                    disabled={!role.permissions['channel-view-all']}
                    onChange={e =>
                      handleSelectChange(
                        'channel-view-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.channels.map(channel => (
                      <MenuItem value={channel.name}>{channel.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper style={paperStyling}>
            <Typography variant="h5">Clients</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['client-manage-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'client-manage-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow client management"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="client-manage-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    multiple
                    labelId="client-manage-specified"
                    label="Choose options"
                    variant="outlined"
                    value={role.permissions['client-manage-specified']}
                    disabled={!role.permissions['client-manage-all']}
                    onChange={e =>
                      handleSelectChange(
                        'client-manage-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.clients.map(client => (
                      <MenuItem value={client.name}>{client.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['client-view-all']}
                      onChange={e =>
                        handleSwitchToggle('client-view-all', e.target.checked)
                      }
                    />
                  }
                  label="Allow client viewing"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="client-view-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    multiple
                    labelId="client-view-specified"
                    label="Choose options"
                    variant="outlined"
                    value={role.permissions['client-view-specified']}
                    disabled={!role.permissions['client-view-all']}
                    onChange={e =>
                      handleSelectChange(
                        'client-view-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.clients.map(client => (
                      <MenuItem value={client.name}>{client.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper style={paperStyling}>
            <Typography variant="h5">Client Roles</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['client-role-manage-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'client-role-manage-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow client role management"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="client-role-manage-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    multiple
                    labelId="client-role-manage-specified"
                    label="Choose options"
                    variant="outlined"
                    value={role.permissions['client-role-manage-specified']}
                    disabled={!role.permissions['client-role-manage-all']}
                    onChange={e =>
                      handleSelectChange(
                        'client-role-manage-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  ></Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['client-role-view-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'client-role-view-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow client role viewing"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="client-role-view-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    multiple
                    labelId="client-role-view-specified"
                    label="Choose options"
                    variant="outlined"
                    value={role.permissions['client-role-view-specified']}
                    disabled={!role.permissions['client-role-view-all']}
                    onChange={e =>
                      handleSelectChange(
                        'client-role-view-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  ></Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
