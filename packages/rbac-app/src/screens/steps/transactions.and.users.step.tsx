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
import {Mediator, Permission, Role, Transaction} from '../../types'

export function TransactionsUsersMediatorsStep(props: {
  role: Role
  transactions: Transaction[]
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
        Set Transactions, Users and Mediators
      </Typography>
      <Typography variant="subtitle1">
        Edit an existing role by changing the categorised permissions.
      </Typography>

      <Divider style={{marginTop: '10px', marginBottom: '10px'}} />

      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Transactions</Typography>

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
                    value={role.permissions['transaction-rerun-specified']}
                    disabled={!role.permissions['transaction-rerun-all']}
                    onChange={e =>
                      handleSelectChange(
                        'transaction-rerun-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.transactions.map(transaction => (
                      <MenuItem key={transaction._id} value={transaction._id}>
                        {transaction._id}
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
                    value={role.permissions['transaction-view-specified']}
                    disabled={!role.permissions['transaction-view-all']}
                    onChange={e =>
                      handleSelectChange(
                        'transaction-view-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.transactions.map(transaction => (
                      <MenuItem key={transaction._id} value={transaction._id}>
                        {transaction._id}
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
                    value={role.permissions['transaction-view-body-specified']}
                    disabled={!role.permissions['transaction-view-body-all']}
                    onChange={e =>
                      handleSelectChange(
                        'transaction-view-body-specified',
                        e.target.value
                      )
                    }
                    renderValue={selected => <PermissionChip data={selected} />}
                  >
                    {props.transactions.map(transaction => (
                      <MenuItem key={transaction._id} value={transaction._id}>
                        {transaction._id}
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
            <Typography variant="h5">Users</Typography>

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
          <Paper elevation={1} style={paperStyling}>
            <Typography variant="h5">Mediators</Typography>

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
                    value={role.permissions['mediator-manage-specified']}
                    disabled={!role.permissions['mediator-manage-all']}
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
                    value={role.permissions['mediator-view-specified']}
                    disabled={!role.permissions['mediator-view-all']}
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
