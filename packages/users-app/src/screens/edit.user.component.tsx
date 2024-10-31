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
import {useLoaderData} from 'react-router-dom'
import {BasicInfo} from '../components/common/basic.info.component'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {editUserByEmail, getRoles, getUsers} from '../services/api'
import {Routes, User} from '../types'

export async function loader({params}) {
  const users = await getUsers()
  const user = users.find(user => user._id === params['userId'])
  if (user.settings === undefined) {
    user.settings = {
      list: {
        tabview: false,
        autoupdate: false
      },
      general: {
        showTooltips: false
      }
    }
  }
  return {user}
}

function AddUserRole() {
  const {user: state} = useLoaderData() as {user: User}
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const originalUser = structuredClone(state as User)
  const [user, setUser] = React.useState(structuredClone(originalUser))
  const getRolesQuery = useQuery(['AddUserRole.getRolesQuery'], getRoles)
  const mutation = useMutation({
    mutationFn: async () => editUserByEmail(originalUser.email, user),
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      showAlert('User edited successfully', 'Success', 'success')
      window.setTimeout(
        () => window.history.pushState({}, '', `/#${Routes.USERS}`),
        1000
      )
    },
    onError: (error: any) => {
      hideBackdrop()
      showAlert(
        'Error editing user. ' + error?.response?.data,
        'Error',
        'error'
      )
    }
  })
  const roles = getRolesQuery.data || []
  const [isFormDataValid, setIsFormDataValid] = React.useState(true)

  const onBasicInfoChange = (event: {user: User; isValid: boolean}) => {
    setUser(event.user)
    setIsFormDataValid(event.isValid)
  }

  const handleEditUser = async () => {
    mutation.mutate()
  }

  if (getRolesQuery.isLoading) {
    return <Loader />
  }

  if (getRolesQuery.isError) {
    return <div>{getRolesQuery.error}</div>
  }

  return (
    <Box padding={3}>
      <header style={{marginBottom: '10px'}}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={400}
          sx={{
            fontSmooth: 'never',
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale'
          }}
        >
          Edit User
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={16}
          gutterBottom
          fontWeight={400}
          sx={{
            fontSmooth: 'never',
            '-webkit-font-smoothing': 'antialiased',
            '-moz-osx-font-smoothing': 'grayscale'
          }}
        >
          Control client systems and their access roles. Edit clients to enable
          their request routing and group them by roles for streamlined channel
          management.
        </Typography>
        <Divider />
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
              <BasicInfo
                roles={roles}
                onChange={onBasicInfoChange}
                user={user}
              />
            </CardContent>
            <Divider />
            <CardActions>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() =>
                    window.history.pushState({}, '', `#${Routes.USERS}`)
                  }
                >
                  CANCEL
                </Button>

                <span style={{marginRight: '10px'}}></span>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    mutation.isLoading ||
                    !isFormDataValid ||
                    JSON.stringify(originalUser) === JSON.stringify(user)
                  }
                  onClick={handleEditUser}
                >
                  UPDATE USER
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
