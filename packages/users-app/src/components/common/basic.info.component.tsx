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
  SelectChangeEvent,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Role, Routes, User} from '../../types'
import {makeStyles} from '@mui/styles'

export function BasicInfo(props: {
  user: User
  roles: Role[]
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string[]>,
    nestedKey?: string
  ) => void
  validationErrors: {[key: string]: string}
  validateUserField?: (field: string, newUserState?: object) => void
}) {
  const navigate = useNavigate()
  const [user, setUser] = React.useState(props.user)

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

  const onBlurredValidation = (e: React.FocusEvent<HTMLInputElement>) => {}

  return (
    <Box>
      <Typography variant="h4">Basic Info</Typography>
      <Typography variant="subtitle1">
        Provide the required client information and assign existing roles for
        access management.
      </Typography>

      <Divider />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstname"
            value={props.user.firstname}
            onChange={props.onChange}
            onBlur={e => props.validateUserField('firstname')}
            error={!!props.validationErrors.firstname}
            helperText={props.validationErrors.firstname}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Surname"
            variant="outlined"
            fullWidth
            name="surname"
            value={props.user.surname}
            onChange={props.onChange}
            onBlur={e => props.validateUserField('surname')}
            error={props.validationErrors.surname ? true : false}
            helperText={props.validationErrors.surname}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={props.user.email}
            onChange={props.onChange}
            onBlur={e => props.validateUserField('email')}
            error={props.validationErrors.email ? true : false}
            helperText={props.validationErrors.email}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-roles">Role</InputLabel>
            <Select
              multiple
              labelId="user-roles"
              label="Role"
              name="groups"
              variant="outlined"
              value={props.user.groups}
              onChange={e => props.onChange(e)}
              onClose={e => props.validateUserField('groups')}
              error={props.validationErrors.groups ? true : false}
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
                        checked={props.user.settings?.list?.tabview}
                        onChange={e => {
                          props.onChange(e, 'settings.list.tabview')
                        }}
                      />
                    }
                    label="Open Transactions in a new tab."
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={props.user.settings?.list?.autoupdate}
                        onChange={e =>
                          props.onChange(e, 'settings.list.autoupdate')
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
                        checked={props.user.settings?.general?.showTooltips}
                        onChange={e =>
                          props.onChange(e, 'settings.general.showTooltips')
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
                        checked={props.user.dailyReport}
                        name="dailyReport"
                        onChange={e => props.onChange(e)}
                      />
                    }
                    label="Receive Daily Channel reports?"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={props.user.weeklyReport}
                        name="weeklyReport"
                        onChange={e => props.onChange(e)}
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
