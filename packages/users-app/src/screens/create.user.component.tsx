import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {createNewUser, getRoles} from '../services/api'
import {Routes} from '../types'
import {defaultUser} from '../utils'

function AddUserRole() {
  const navigate = useNavigate()
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const [user, setUser] = React.useState(structuredClone(defaultUser))
  const queryKey = React.useMemo(() => ['query.AddUserRole'], [])
  const query = useQuery(queryKey, getRoles, {
    staleTime: 1000 * 30 // Data is fresh for 30 seconds seconds
  })
  const mutation = useMutation({
    mutationFn: createNewUser,
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      navigate(Routes.USERS)
    },
    onError: error => {
      hideBackdrop()
      showAlert('Error creating a new user', 'Error', 'error')
    }
  })
  const roles = query.data || {}

  if (query.isLoading) {
    return <Loader />
  }

  if (query.isError) {
    return <div>{query.error}</div>
  }

  const handleAddUser = async () => {
    mutation.mutate(user)
  }

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
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
            <CardContent></CardContent>
            <Divider />
            <CardActions>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>

                <span style={{marginRight: '10px'}}></span>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={mutation.isLoading || user.firstname.trim() === ''}
                  onClick={handleAddUser}
                >
                  Create User
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
