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

    // @ts-ignore
    newRole['permissions'][permission] = checked

    if (checked) {
      const apps = props.apps.map(c => c.name)

      if (permission === 'app-view-all') {
        newRole['permissions']['app-view-specified'].length === 0 &&
          (newRole['permissions']['app-view-specified'] = apps)
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
        Set Additional Permissions
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
              Apps
            </Typography>

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
              Audit Trails & Logs
            </Typography>

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
              Certificates
            </Typography>

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
              Contacts
            </Typography>

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
              Metadata
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['metadata-manage-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'metadata-manage-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow Metadata management"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['metadata-view-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'metadata-view-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow metadata viewing"
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
              Visualizer
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['visualizer-manage']}
                      onChange={e =>
                        handleSwitchToggle(
                          'visualizer-manage',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow visualizer management"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['visualizer-view']}
                      onChange={e =>
                        handleSwitchToggle('visualizer-view', e.target.checked)
                      }
                    />
                  }
                  label="Allow visualizer viewing"
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
              Data Management
            </Typography>

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

              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['service-manage']}
                      onChange={e =>
                        handleSwitchToggle('service-manage', e.target.checked)
                      }
                    />
                  }
                  label="Allow service management"
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
              MISC.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['auth-type-view-all']}
                      onChange={e =>
                        handleSwitchToggle(
                          'auth-type-view-all',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Allow authentication type viewing"
                />
              </Grid>

              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={role.permissions['events-view-all']}
                      onChange={e =>
                        handleSwitchToggle('events-view-all', e.target.checked)
                      }
                    />
                  }
                  label="Allow events viewing"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
