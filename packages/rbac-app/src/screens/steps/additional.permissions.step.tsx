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
import {App, Permission, Role} from '../../types'

export function AdditionalPermissionsStep(props: {
  role: Role
  apps: App[]
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

    ;(newRole.permissions[permission] as boolean) = checked

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

  const paperStyling = {padding: '10px 20px'}

  return (
    <Box>
      <Typography variant="h6">Set Additional Permissions</Typography>
      <Typography variant="subtitle1">
        Edit an existing role by changing the categorised permissions.
      </Typography>

      <Divider style={{marginTop: '10px', marginBottom: '10px'}} />

      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Apps</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['app-view-all']}
                      onChange={e =>
                        handleSwitchToggle('app-view-all', e.target.checked)
                      }
                    />
                  }
                  label="Allow app viewing"
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="app-view-specified">
                    Choose options
                  </InputLabel>
                  <Select
                    startAdornment={<InputAdornment />}
                    labelId="app-view-specified"
                    label="Choose options"
                    multiple
                    variant="outlined"
                    value={role.permissions?.['app-view-specified'] ?? []}
                    disabled={!role.permissions?.['app-view-all']}
                    onChange={e =>
                      handleSelectChange('app-view-specified', e.target.value)
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.apps.map(app => (
                      <MenuItem key={app.name} value={app.name}>
                        {app.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Audit Trails & Logs</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['audit-trail-view']}
                      onChange={e =>
                        handleSwitchToggle('audit-trail-view', e.target.checked)
                      }
                    />
                  }
                  label="Allow audit trail viewing"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['logs-view']}
                      onChange={e =>
                        handleSwitchToggle('logs-view', e.target.checked)
                      }
                    />
                  }
                  label="Allow log viewing"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Certificates</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['certificates-manage']}
                      onChange={e =>
                        handleSwitchToggle(
                          'certificates-manage',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow certificate management"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['certificates-view']}
                      onChange={e =>
                        handleSwitchToggle(
                          'certificates-view',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow cerificate viewing"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Contacts</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['contact-list-manage']}
                      onChange={e =>
                        handleSwitchToggle(
                          'contact-list-manage',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow contact management"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['contact-list-view']}
                      onChange={e =>
                        handleSwitchToggle(
                          'contact-list-view',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow contact viewing"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Data Management</Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['import-export']}
                      onChange={e =>
                        handleSwitchToggle('import-export', e.target.checked)
                      }
                    />
                  }
                  label="Allow import & export of data"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
