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
  Typography
} from '@mui/material'
import React from 'react'
import {InputAdornment} from '../../components/helpers/input.adornment.component'
import {PermissionChip} from '../../components/helpers/permission.chip.component'
import {Channel, Mediator, Permission, Role, Transaction} from '../../types'

export function TransactionsUsersMediatorsStep(props: {
  role: Role
  transactions: Transaction[]
  channels: Channel[]
  mediators: Mediator[]
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
    const newRole = structuredClone(role)

    // @ts-ignore
    newRole['permissions'][permission] = checked

    if (checked) {
      const channels = props.channels.map(c => c.name)
      const mediators = props.mediators.map(m => m.name)

      if (permission === 'transaction-rerun-all') {
        newRole['permissions']['transaction-rerun-specified'].length === 0 &&
          (newRole['permissions']['transaction-rerun-specified'] = channels)

        if (!newRole.permissions['transaction-view-all']) {
          newRole['permissions']['transaction-view-all'] = true
          newRole['permissions']['transaction-view-specified'] = channels
        }
      } else if (permission === 'transaction-view-all') {
        newRole['permissions']['transaction-view-specified'].length === 0 &&
          (newRole['permissions']['transaction-view-specified'] = channels)
      } else if (permission === 'transaction-view-body-all') {
        newRole['permissions']['transaction-view-body-specified'].length ===
          0 &&
          (newRole['permissions']['transaction-view-body-specified'] = channels)
      } else if (permission === 'mediator-manage-all') {
        newRole['permissions']['mediator-manage-specified'].length === 0 &&
          (newRole['permissions']['mediator-manage-specified'] = mediators)

        if (!newRole.permissions['mediator-view-all']) {
          newRole['permissions']['mediator-view-all'] = true
          newRole['permissions']['mediator-view-specified'] = mediators
        }
      }
    }

    setRole(newRole)
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

  const paperStyling = {
    padding: '10px 20px',
    borderRadius: '8px',
    background: '#FDFDFD',
    border: '1px solid #EEE'
  }

  return (
    <Box>
      <Typography
        sx={{
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '133.4%',
          color: 'var(--text-primary, rgba(0, 0, 0, 0.87))'
        }}
        variant="h5"
      >
        Set Transactions, Users and Mediators
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '143%',
          letterSpacing: '0.17px',
          color: 'var(--text-primary, rgba(0, 0, 0, 0.60))'
        }}
      >
        Edit an existing role by changing the categorised permissions.
      </Typography>

      <Divider style={{marginTop: '10px', marginBottom: '10px'}} />

      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Paper elevation={0} style={paperStyling}>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--text-primary, rgba(0, 0, 0, 0.87))',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: '160%',
                letterSpacing: '0.15px'
              }}
            >
              Transactions
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['transaction-rerun-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'transaction-rerun-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow transaction reruns"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="transaction-rerun-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    labelId="transaction-rerun-specified"
                    multiple
                    label="Choose options"
                    variant="outlined"
                    value={
                      role.permissions?.['transaction-rerun-specified'] ?? []
                    }
                    disabled={!role.permissions?.['transaction-rerun-all']}
                    onChange={e =>
                      handleSelectChange(
                        'transaction-rerun-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.channels.map(channel => (
                      <MenuItem key={channel.name} value={channel.name}>
                        {channel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['transaction-view-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'transaction-view-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow transaction viewing"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="transaction-view-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    multiple
                    labelId="transaction-view-specified"
                    label="Choose options"
                    variant="outlined"
                    value={
                      role.permissions?.['transaction-view-specified'] ?? []
                    }
                    disabled={!role.permissions?.['transaction-view-all']}
                    onChange={e =>
                      handleSelectChange(
                        'transaction-view-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.channels.map(channel => (
                      <MenuItem key={channel.name} value={channel.name}>
                        {channel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['transaction-view-body-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'transaction-view-body-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow body viewing"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="transaction-view-body-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    labelId="transaction-view-body-specified"
                    multiple
                    label="Choose options"
                    variant="outlined"
                    value={
                      role.permissions?.['transaction-view-body-specified'] ??
                      []
                    }
                    disabled={!role.permissions?.['transaction-view-body-all']}
                    onChange={e =>
                      handleSelectChange(
                        'transaction-view-body-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.channels.map(channel => (
                      <MenuItem key={channel.name} value={channel.name}>
                        {channel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} style={paperStyling}>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--text-primary, rgba(0, 0, 0, 0.87))',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: '160%',
                letterSpacing: '0.15px'
              }}
            >
              Users
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['user-manage']}
                      onChange={e =>
                        handleSwitchToggle('user-manage', e.target.checked)
                      }
                    />
                  }
                  label="Allow user management"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['user-view']}
                      onChange={e =>
                        handleSwitchToggle('user-view', e.target.checked)
                      }
                    />
                  }
                  label="Allow user viewing"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['user-role-manage']}
                      onChange={e =>
                        handleSwitchToggle('user-role-manage', e.target.checked)
                      }
                    />
                  }
                  label="Allow user role management"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['user-role-view']}
                      onChange={e =>
                        handleSwitchToggle('user-role-view', e.target.checked)
                      }
                    />
                  }
                  label="Allow user role viewing"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} style={paperStyling}>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--text-primary, rgba(0, 0, 0, 0.87))',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: '500',
                lineHeight: '160%',
                letterSpacing: '0.15px'
              }}
            >
              Mediators
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['mediator-manage-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'mediator-manage-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow mediator management"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="mediator-manage-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    labelId="mediator-manage-specified"
                    multiple
                    variant="outlined"
                    label="Choose options"
                    value={
                      role.permissions?.['mediator-manage-specified'] ?? []
                    }
                    disabled={!role.permissions?.['mediator-manage-all']}
                    onChange={e =>
                      handleSelectChange(
                        'mediator-manage-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.mediators.map(mediator => (
                      <MenuItem key={mediator.name} value={mediator.name}>
                        {mediator.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['mediator-view-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'mediator-view-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow mediator viewing"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="mediator-view-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    multiple
                    labelId="mediator-view-specified"
                    label="Choose options"
                    variant="outlined"
                    value={role.permissions?.['mediator-view-specified'] ?? []}
                    disabled={!role.permissions?.['mediator-view-all']}
                    onChange={e =>
                      handleSelectChange(
                        'mediator-view-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.mediators.map(mediator => (
                      <MenuItem key={mediator.name} value={mediator.name}>
                        {mediator.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
