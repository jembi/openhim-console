import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
import {useLoaderData, useLocation, useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {
  editRoleByName,
  getApps,
  getChannels,
  getClients,
  getMediators,
  getTransactions
} from '../services/api'
import {Role, Routes} from '../types'
import {AdditionalPermissionsStep} from './steps/additional.permissions.step'
import {ChannelsClientsStep} from './steps/channels.and.clients.step'
import {TransactionsUsersMediatorsStep} from './steps/transactions.and.users.step'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {getRoles} from '../services/api'

const steps = [
  'Channels & Clients',
  'Transactions, Users & Mediators',
  'Additional Permissions'
]

const queryFn = async () => {
  const [channels, clients, transactions, mediators, apps] = await Promise.all([
    getChannels(),
    getClients(),
    getTransactions(),
    getMediators(),
    getApps()
  ])

  return {channels, clients, transactions, mediators, apps}
}

export async function loader({params}) {
  const roles = await getRoles()
  const role = roles.find(role => role.name === params.roleName)
  return {role}
}

function EditUserRole() {
  const navigate = useNavigate()
  const {role: state} = useLoaderData() as {role: Role}
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const [activeStep, setActiveStep] = React.useState(0)
  const originalRole = structuredClone(state)
  const [role, setRole] = React.useState<Role>(structuredClone(state))
  const queryKey = React.useMemo(() => ['query.EditUserRole'], [])
  const query = useQuery(queryKey, queryFn, {
    staleTime: 1000 * 30 // Data is fresh for 30 seconds seconds
  })

  const mutation = useMutation({
    mutationFn: () => editRoleByName(originalRole.name, role),
    onMutate: () => {
      showBackdrop(<Loader />, false)
    },
    onSuccess: () => {
      hideBackdrop()
      navigate(Routes.ROLES)
    },
    onError: error => {
      hideBackdrop()
      showAlert('Error editing role', 'Error', 'error')
    }
  })
  const {channels, clients, mediators, transactions, apps} = query.data || {}

  if (query.isLoading) {
    return <Loader />
  }

  if (query.isError) {
    return <div>{query.error}</div>
  }

  const handleEditRole = async () => {
    mutation.mutate()
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
      <header style={{marginBottom: '40px'}}>
        <Typography variant="h4" gutterBottom fontWeight={400}>
          Edit User Role
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
          <a
            style={{color: 'grey'}}
            href="https://openhim.org/docs/introduction/about"
          >
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
                    clients={clients}
                    channels={channels}
                    onChange={setRole}
                  />
                )}
                {activeStep === 1 && (
                  <TransactionsUsersMediatorsStep
                    role={role}
                    mediators={mediators}
                    transactions={transactions}
                    channels={channels}
                    onChange={setRole}
                  />
                )}
                {activeStep === 2 && (
                  <AdditionalPermissionsStep
                    role={role}
                    apps={apps}
                    onChange={setRole}
                  />
                )}
              </div>
            </CardContent>
            <Divider />
            <CardActions>
              <Box display="flex" justifyContent="space-between">
                {activeStep === 0 && (
                  <Button
                    variant="outlined"
                    color="info"
                    href={`/#${Routes.ROLES}`}
                  >
                    Cancel
                  </Button>
                )}
                {activeStep > 0 && (
                  <Button color="info" variant="outlined" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <span style={{marginRight: '10px'}}></span>
                {activeStep != steps.length - 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={mutation.isLoading || role.name.trim() === ''}
                  >
                    Next
                  </Button>
                )}
                {activeStep == steps.length - 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      mutation.isLoading ||
                      role.name.trim() === '' ||
                      JSON.stringify(role) === JSON.stringify(originalRole)
                    }
                    onClick={handleEditRole}
                  >
                    Edit Role
                  </Button>
                )}
              </Box>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EditUserRole
