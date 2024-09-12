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
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {
  createNewRole,
  getApps,
  getChannels,
  getClients,
  getMediators,
  getTransactions
} from '../services/api'
import {Routes} from '../types'
import {defaultRole} from '../utils'
import {AdditionalPermissionsStep} from './steps/additional.permissions.step'
import {ChannelsClientsStep} from './steps/channels.and.clients.step'
import {TransactionsUsersMediatorsStep} from './steps/transactions.and.users.step'

const steps = [
  'Channels & Clients',
  'Transactions, Users & Mediators',
  'Additional Permissions'
]

const queryFn = async () => {
  try {
    const [channels, clients, transactions, mediators, apps] =
      await Promise.all([
        getChannels(),
        getClients(),
        getTransactions(),
        getMediators(),
        getApps()
      ])

    return {channels, clients, transactions, mediators, apps}
  } catch (err) {
    throw err
  }
}

function AddUserRole() {
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const [activeStep, setActiveStep] = React.useState(0)
  const [role, setRole] = React.useState(structuredClone(defaultRole))
  const queryKey = React.useMemo(() => ['query.AddUserRole'], [])
  const query = useQuery(queryKey, queryFn, {
    staleTime: 1000 * 30 // Data is fresh for 30 seconds seconds
  })
  const mutation = useMutation({
    mutationFn: createNewRole,
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      window.setTimeout(() => {
        window.location.href = `/#${Routes.ROLES}`
      }, 100)
    },
    onError: (error: any) => {
      const err = error?.response?.data ?? 'An unexpected error occurred'
      hideBackdrop()
      showAlert('Error creating a new role' + err, 'Error', 'error')
    }
  })
  const {channels, clients, mediators, transactions, apps} = query.data || {}

  if (query.isLoading) {
    return <Loader />
  }

  if (query.isError) {
    return <div>{query.error}</div>
  }

  const handleAddRole = async () => {
    mutation.mutate(role)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
      <header style={{marginBottom: '10px'}}>
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
          <Card style={{width: '680px'}} elevation={4}>
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
                    channels={channels}
                    mediators={mediators}
                    transactions={transactions}
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
                    disabled={mutation.isLoading || role.name.trim() === ''}
                    onClick={handleAddRole}
                  >
                    Add Role
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

export default AddUserRole
