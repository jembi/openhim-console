import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
import {useLoaderData, useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {
  editRoleByName,
  getApps,
  getChannels,
  getClients,
  getMediators,
  getRoles,
  getTransactions
} from '../services/api'
import {Role, Routes} from '../types'
import {AdditionalPermissionsStep} from './steps/additional.permissions.step'
import {ChannelsClientsStep} from './steps/channels.and.clients.step'
import {TransactionsUsersMediatorsStep} from './steps/transactions.and.users.step'

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
  const [activeTab, setActiveTab] = React.useState(0)
  const originalRole = structuredClone(state)
  const [role, setRole] = React.useState<Role>(structuredClone(state))
  const queryKey = React.useMemo(() => ['query.EditUserRole'], [])
  const query = useQuery(queryKey, queryFn, {
    staleTime: 1000 * 30 // Data is fresh for 30 seconds
  })

  const mutation = useMutation({
    mutationFn: () => editRoleByName(originalRole.name, role),
    onMutate: () => {
      showBackdrop(<Loader />, false)
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
      showAlert('Error editing role' + err, 'Error', 'error')
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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
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
          For more details instructions, visit our{' '}
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
                <Tabs
                  value={activeTab}
                  onChange={handleChangeTab}
                  aria-label="role edit tabs"
                  variant="fullWidth"
                >
                  {steps.map((label, index) => (
                    <Tab key={index} label={label} />
                  ))}
                </Tabs>
              </div>
              <Divider />
              <div style={{marginTop: '10px'}}>
                {activeTab === 0 && (
                  <ChannelsClientsStep
                    role={role}
                    clients={clients}
                    channels={channels}
                    onChange={setRole}
                  />
                )}
                {activeTab === 1 && (
                  <TransactionsUsersMediatorsStep
                    role={role}
                    mediators={mediators}
                    transactions={transactions}
                    channels={channels}
                    onChange={setRole}
                  />
                )}
                {activeTab === 2 && (
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
                <Button
                  variant="outlined"
                  color="info"
                  href={`/#${Routes.ROLES}`}
                >
                  Cancel
                </Button>
                &nbsp;&nbsp;
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
              </Box>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EditUserRole
