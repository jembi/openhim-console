import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  SelectChangeEvent,
  Typography
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate, useLocation, useLoaderData} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {
  createNewUser,
  editUserByEmail,
  getRoles,
  getUsers
} from '../services/api'
import {Routes, User} from '../types'
import {BasicInfo} from '../components/common/basic.info.component'
import {handleFieldValidationAndUpdateErrors, handleOnChange} from './helper'

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
  const navigate = useNavigate()
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const originalUser = structuredClone(state as User)
  const [user, setUser] = React.useState(structuredClone(originalUser))
  const [validationErrors, setValidationErrors] = React.useState<{
    [key: string]: string
  }>({})
  const getRolesQuery = useQuery(['AddUserRole.getRolesQuery'], getRoles)
  const mutation = useMutation({
    mutationFn: async () => editUserByEmail(originalUser.email, user),
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      window.history.pushState({}, '', `/#${Routes.USERS}`)
    },
    onError: error => {
      hideBackdrop()
      showAlert('Error editing user', 'Error', 'error')
    }
  })
  const roles = getRolesQuery.data || []
  const [isFormDataValid, setIsFormDataValid] = React.useState(true)

  const onBasicInfoChange = (event: {user: any; isValid: boolean}) => {
    setUser(event.user)
    setIsFormDataValid(event.isValid)
  }

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string[]>,
    nestedKey?: string
  ) => {
    handleOnChange(nestedKey, user, e, setUser, validateUserField)
  }

  const validateUserField = (field: string, newBasicInfoState?: object) => {
    handleFieldValidationAndUpdateErrors(
      newBasicInfoState,
      user,
      field,
      setValidationErrors,
      validationErrors,
      setIsFormDataValid
    )
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
        <Typography variant="h4" gutterBottom fontWeight={400}>
          Edit User
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={16}
          gutterBottom
          fontWeight={400}
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
                onChange={onChange}
                user={user}
                validationErrors={validationErrors}
                validateUserField={validateUserField}
              />
            </CardContent>
            <Divider />
            <CardActions>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => navigate(-1)}
                >
                  CANCEL
                </Button>

                <span style={{marginRight: '10px'}}></span>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={mutation.isLoading || !isFormDataValid}
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
