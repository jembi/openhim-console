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
import {BasicInfo} from '../components/common/basic.info.component'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {createNewUser, getRoles} from '../services/api'
import {Routes, User} from '../types'
import {defaultUser} from '../utils'
import {handleFieldValidationAndUpdateErrors, handleOnChange} from './helper'
import {BasePageTemplate} from '../../../base-components'

function AddUserRole() {
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
      window.history.pushState({}, '', `/#${Routes.USERS}`)
    },
    onError: (error: any) => {
      hideBackdrop()
      showAlert(
        'Error creating a new user. ' + error?.response?.data,
        'Error',
        'error'
      )
    }
  })
  const roles = query.data || []
  const [isFormDataValid, setIsFormDataValid] = React.useState(false)

  const onBasicInfoChange = (event: {user: User; isValid: boolean}) => {
    setUser(event.user)
    setIsFormDataValid(event.isValid)
  }

  const handleAddUser = async () => {
    mutation.mutate(user)
  }

  if (query.isLoading) {
    return <Loader />
  }

  if (query.isError) {
    return <div>{query.error}</div>
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
          Add User
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
          Control client systems and their access roles. Add clients to enable
          their request routing and group them by roles for streamlined channel
          management.
        </Typography>
        <Divider />
      </header>

      <BasePageTemplate
        title="Add User"
        subtitle="Control client systems and their access roles. Add clients to enable their request routing and group them by roles for streamlined channel management."
      >
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
                    Cancel
                  </Button>

                  <span style={{marginRight: '10px'}}></span>

                  <Button
                    variant="contained"
                    color="primary"
                    disabled={mutation.isLoading || !isFormDataValid}
                    onClick={handleAddUser}
                  >
                    Add User
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </BasePageTemplate>
    </Box>
  )
}

export default AddUserRole
