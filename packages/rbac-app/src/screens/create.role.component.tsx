import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
  Paper
} from '@mui/material'
import React from 'react'
import {useLoaderData, useNavigate, useNavigation} from 'react-router-dom'
import {defaultRole} from '../utils'
import {Channel, CreateRoleLoader, Permission, Role} from '../types'
import Loader from '../components/helpers/loader.component'

const steps = [
  'Channels & Clients',
  'Transactions, Users & Mediators',
  'Additional Permissions'
]

const ChannelsClientsStep = (props: {
  role: Role
  channels: Channel[]
  onChange: (role: Role) => void
}) => {
  const {state} = useNavigation()
  const [role, setRole] = React.useState(props.role)

  React.useEffect(() => {
    props.onChange(role)
  }, [role])

  if (state === 'loading') {
    return <Loader />
  }

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
          <Card
            elevation={0}
            style={{boxShadow: '0px', border: '1px', borderRadius: '0px'}}
          >
            <CardHeader title="Role Name" />
            <CardContent>
              <Grid container>
                <Grid item xs={8}>
                  <TextField
                    label="Role Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={role.name}
                    onChange={e => setRole({...role, name: e.target.value})}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Channels" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        value={role.permissions['channel-manage-all']}
                        onChange={e => {}}
                      />
                    }
                    label="Allow channel management"
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      label="Choose options"
                      variant="outlined"
                      value={role.permissions['channel-manage-specified']}
                      disabled={!role.permissions['channel-manage-all']}
                    >
                      {props.channels.map(channel => (
                        <MenuItem value={channel.name}>{channel.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch />}
                    label="Allow channel viewing"
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      label="Choose options"
                      variant="outlined"
                      defaultValue=""
                    >
                      <MenuItem value="">Manage None</MenuItem>
                      {/* Add more options as needed */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Clients" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Allow client management"
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      label="Choose options"
                      variant="outlined"
                      defaultValue=""
                    >
                      <MenuItem value="">Manage All</MenuItem>
                      {/* Add more options as needed */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Allow client viewing"
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      label="Choose options"
                      variant="outlined"
                      defaultValue=""
                    >
                      <MenuItem value="">View All</MenuItem>
                      {/* Add more options as needed */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Client Roles" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Allow client role management"
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      label="Choose options"
                      variant="outlined"
                      defaultValue=""
                    >
                      <MenuItem value="">Manage X</MenuItem>
                      <MenuItem value="">Manage Y</MenuItem>
                      {/* Add more options as needed */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Allow client role viewing"
                  />
                  <FormControl fullWidth margin="normal">
                    <Select
                      label="Choose options"
                      variant="outlined"
                      defaultValue=""
                    >
                      <MenuItem value="">Manage X</MenuItem>
                      <MenuItem value="">Manage Y</MenuItem>
                      {/* Add more options as needed */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

const TransactionsUsersMediatorsStep = () => (
  <Box>
    <Typography variant="h6">Set Transactions, Users and Mediators</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Transactions</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow transaction reruns"
        />
        <FormControl fullWidth margin="normal">
          <Select label="Choose options" variant="outlined" defaultValue="">
            <MenuItem value="">Manage None</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow transaction viewing"
        />
        <FormControl fullWidth margin="normal">
          <Select label="Choose options" variant="outlined" defaultValue="">
            <MenuItem value="">Manage None</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel control={<Switch />} label="Allow body viewing" />
        <FormControl fullWidth margin="normal">
          <Select label="Choose options" variant="outlined" defaultValue="">
            <MenuItem value="">Manage None</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Users</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel control={<Switch />} label="Allow user management" />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel control={<Switch />} label="Allow user viewing" />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow user role management"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow user role viewing"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Mediators</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow mediator management"
        />
        <FormControl fullWidth margin="normal">
          <Select label="Choose options" variant="outlined" defaultValue="">
            <MenuItem value="">Manage None</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel control={<Switch />} label="Allow mediator viewing" />
        <FormControl fullWidth margin="normal">
          <Select label="Choose options" variant="outlined" defaultValue="">
            <MenuItem value="">View None</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </Box>
)

const AdditionalPermissionsStep = () => (
  <Box>
    <Typography variant="h6">Set Additional Permissions</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Apps</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel control={<Switch />} label="Allow app viewing" />
        <FormControl fullWidth margin="normal">
          <Select label="Choose options" variant="outlined" defaultValue="">
            <MenuItem value="">View None</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Audit Trails & Logs</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow audit trail viewing"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel control={<Switch />} label="Allow log viewing" />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Certificates</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow certificate management"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow certificate viewing"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Contacts</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow contact management"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel control={<Switch />} label="Allow contact viewing" />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Data Management</Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={<Switch />}
          label="Allow import & export of data"
        />
      </Grid>
    </Grid>
  </Box>
)

function AddUserRole() {
  const navigate = useNavigate()
  const {channels} = useLoaderData() as CreateRoleLoader
  const [activeStep, setActiveStep] = React.useState(0)
  const [role, setRole] = React.useState(structuredClone(defaultRole))

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <Box padding={3}>
      <header style={{marginBottom: '40px'}}>
        <Typography variant="h4" gutterBottom fontWeight={400}>
          Add User Role
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={16}
          gutterBottom
          fontWeight={400}
        >
          Easily assign and manage roles and permissions to users by selecting a
          role, viewing and editing its permissions, or creating a new role with
          customized permissions.
          <br />
          For more details instructions, visit out{' '}
          <a style={{color: 'grey'}} href="#">
            Help Section
          </a>
          .
        </Typography>
      </header>

      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Card style={{width: '600px'}} elevation={4}>
            <Divider />
            <CardContent>
              <div style={{marginBottom: '10px'}}>
                <Stepper activeStep={activeStep}>
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
              <Divider />
              <div style={{marginTop: '10px'}}>
                {activeStep === 0 && (
                  <ChannelsClientsStep
                    role={role}
                    channels={channels}
                    onChange={setRole}
                  />
                )}
                {activeStep === 1 && <TransactionsUsersMediatorsStep />}
                {activeStep === 2 && <AdditionalPermissionsStep />}
              </div>
            </CardContent>
            <Divider />
            <CardActions>
              <Box display="flex" justifyContent="space-between">
                {activeStep === 0 && (
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                )}
                {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Add Role' : 'Next'}
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddUserRole
