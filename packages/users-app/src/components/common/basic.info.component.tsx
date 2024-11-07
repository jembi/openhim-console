import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material'
import React, {useRef} from 'react'
import {z} from 'zod'
import {Role, Routes, User} from '../../types'

export const basicInfoSchema = z.object({
  email: z.string().email(),
  firstname: z.string().min(1, 'Firstname cannot be empty'),
  surname: z.string().min(1, 'Surname cannot be empty'),
  password: z.string().optional(),
  groups: z.array(z.string()).min(1, 'Please select at least one role'),
  provider: z.string().optional(),
  msisdn: z.string().optional(),
  dailyReport: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  locked: z.boolean().optional(),
  passports: z.string().optional(),
  settings: z
    .object({
      list: z.object({
        tabview: z.boolean(),
        autoupdate: z.boolean()
      }),
      general: z.object({
        showTooltips: z.boolean()
      })
    })
    .optional(),
  token: z.string().nullable().optional(),
  tokenType: z.string().nullable().optional()
})

export function BasicInfo(props: {
  user: Readonly<User>
  roles: Readonly<Role[]>
  onChange: (event: {user: User; isValid: boolean}) => void
}) {
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const hasMounted = React.useRef(false)
  const [isTouched, setIsTouched] = React.useState(false)
  const [user, setUser] = React.useState(props.user)
  const [validationErrors, setValidationErrors] = React.useState<
    null | z.ZodIssue[]
  >(null)

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

  const getFieldErrorMessage = (field: keyof User) => {
    return validationErrors?.find(error => error.path[0] === field)?.message
  }

  const handleValidation = () => {
    const validationResult = basicInfoSchema.safeParse(user)

    if (validationResult.success) {
      setValidationErrors(null)
    } else {
      setValidationErrors(validationResult.error.errors)
    }

    let passwordValid = true

    if (user.password) {
      passwordValid = user.password == confirmPassword
    }

    props.onChange({
      user,
      isValid: validationResult.success && passwordValid
    })
  }

  React.useEffect(() => {
    if (hasMounted.current) {
      setIsTouched(true)
      handleValidation()
    } else {
      hasMounted.current = true
    }
  }, [user])

  return (
    <Box>
      <Typography variant="h4">Basic Info</Typography>
      <Typography variant="subtitle1">
        Provide the required client information and assign existing roles for
        access management.
      </Typography>

      <Divider sx={{pt: '10px', pb: '10px'}} />
      <br />
      <br />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstname"
            value={user.firstname}
            onChange={e => setUser({...user, firstname: e.target.value})}
            error={isTouched && getFieldErrorMessage('firstname') !== undefined}
            helperText={isTouched && getFieldErrorMessage('firstname')}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Surname"
            variant="outlined"
            fullWidth
            name="surname"
            value={user.surname}
            error={isTouched && getFieldErrorMessage('surname') !== undefined}
            helperText={isTouched && getFieldErrorMessage('surname')}
            onChange={e => setUser({...user, surname: e.target.value})}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={user.email}
            error={isTouched && getFieldErrorMessage('email') !== undefined}
            helperText={isTouched && getFieldErrorMessage('email')}
            onChange={e => setUser({...user, email: e.target.value})}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={user.password}
            onChange={e => setUser({...user, password: e.target.value})}
            error={isTouched && getFieldErrorMessage('password') !== undefined}
            helperText={isTouched && getFieldErrorMessage('password')}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            error={
              isTouched && !!user.password && confirmPassword != user.password
            }
            helperText={
              isTouched &&
              !!user.password &&
              confirmPassword != user.password &&
              'Passwords do not match'
            }
            onChange={e => {
              setConfirmPassword(e.target.value)
              handleValidation()
            }}
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
              value={user.groups}
              onChange={e => handleSelectChange('groups', e.target.value)}
              error={isTouched && getFieldErrorMessage('groups') !== undefined}
            >
              {props.roles.map((role, index) => (
                <MenuItem key={index} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {isTouched && getFieldErrorMessage('groups') && (
              <FormHelperText error>
                {getFieldErrorMessage('groups')}
              </FormHelperText>
            )}
          </FormControl>
          <Typography marginLeft={1} variant="body2">
            Specific user role missing? &nbsp;
            <Typography
              component={'a'}
              href={`${Routes.ADD_ROLE}`}
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
                        checked={user.settings?.list?.tabview}
                        onChange={e => {
                          const newUser = structuredClone(user)
                          newUser.settings.list.tabview = e.target.checked
                          setUser(newUser)
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
                        checked={user.settings?.list?.autoupdate}
                        onChange={e => {
                          const newUser = structuredClone(user)
                          newUser.settings.list.autoupdate = e.target.checked
                          setUser(newUser)
                        }}
                      />
                    }
                    label="Auto-update Transaction List."
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.settings?.general?.showTooltips}
                        onChange={e => {
                          const newUser = structuredClone(user)
                          newUser.settings.general.showTooltips =
                            e.target.checked
                          setUser(newUser)
                        }}
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
