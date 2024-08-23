import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Role, Routes, User} from '../../types'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(_theme => ({
  divider: {
    marginTop: '10px',
    margin: '0px',
    width: '100%',
    marginBottom: '10px',
    overflow: 'visible'
  }
}))

export function BasicInfo(props: {
  user: User
  roles: Role[]
  onChange: (event: {user: User; isValid: boolean}) => unknown
}) {
  const classes = useStyles()
  const navigate = useNavigate()
  const [user, setUser] = React.useState(props.user)

  React.useEffect(() => {
    props.onChange({
      user,
      isValid:
        !!user.firstname.trim() &&
        !!user.surname.trim() &&
        !!user.email.trim() &&
        user.groups?.length > 0
    })
  }, [user])

  const handleSwitchToggle = (key: keyof User, checked: boolean) => {
    setUser({
      ...user,
      [key]: checked
    })
  }

  const handleSelectChange = (key: keyof User, value: string | string[]) => {
    const data = typeof value === 'string' ? value.split(',') : value

    setUser({
      ...user,
      [key]: data
    })
  }

  return (
    <Box>
      <Typography variant="h4">Basic Info</Typography>
      <Typography variant="subtitle1">
        Provide the required client information and assign existing roles for
        access management.
      </Typography>

      <Divider className={classes.divider} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.firstname}
            onChange={e => setUser({...user, firstname: e.target.value})}
            error={user.firstname.trim() === ''}
            helperText={
              user.firstname.trim() === ''
                ? 'First Name cannot be empty'
                : undefined
            }
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Surname"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.surname}
            onChange={e => setUser({...user, surname: e.target.value})}
            error={user.surname.trim() === ''}
            helperText={
              user.surname.trim() === '' ? 'Surname cannot be empty' : undefined
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={user.email}
            onChange={e => setUser({...user, email: e.target.value})}
            error={user.email.trim() === ''}
            helperText={
              user.email.trim() === '' ? 'Email cannot be empty' : undefined
            }
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-roles">Role</InputLabel>
            <Select
              multiple
              labelId="user-roles"
              label="Role"
              variant="outlined"
              value={user.groups || []}
              onChange={e => handleSelectChange('groups', e.target.value)}
              error={user.groups?.length === 0}
            >
              {props.roles.map((role, index) => (
                <MenuItem key={index} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography marginLeft={1} variant="body2">
            Specific user role missing? &nbsp;
            <Typography
              component={'a'}
              onClick={() => navigate(Routes.ADD_ROLE)}
              color="primary"
            >
              Add a new role
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={0}>
            <CardHeader title="Preference" />
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.settings?.openTransactionInNewTab}
                        onChange={e =>
                          handleSwitchToggle('settings.openTransactionInNewTab' as keyof User, e.target.checked)
                        }
                      />
                    }
                    label="Open Transactions in a new tab."
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.settings?.autoUpdateTransactionList}
                        onChange={e =>
                          handleSwitchToggle('settings.autoUpdateTransactionList' as keyof User, e.target.checked)
                        }
                      />
                    }
                    label="Auto-update Transaction List."
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.settings?.showTooltips}
                        onChange={e =>
                          handleSwitchToggle('settings.showToolTips' as keyof User, e.target.checked)
                        }
                      />
                    }
                    label="Show Tooltips"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={0}>
            <CardHeader title="Reports" />
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.dailyReport}
                        onChange={e =>
                          handleSwitchToggle('dailyReport', e.target.checked)
                        }
                      />
                    }
                    label="Receive Daily Channel reports?"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.weeklyReport}
                        onChange={e =>
                          handleSwitchToggle('weeklyReport', e.target.checked)
                        }
                      />
                    }
                    label="Receive Weekly Channel reports?"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
