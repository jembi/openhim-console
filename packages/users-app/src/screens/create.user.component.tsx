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
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {createNewUser, getRoles} from '../services/api'
import {Routes} from '../types'
import {defaultUser, getNestedProp} from '../utils'
import {BasicInfo} from '../components/common/basic.info.component'
import {userSchema} from '../utils'
import {handleFieldValidationAndUpdateErrors, handleOnChange} from './helper'

function AddUserRole() {
  const navigate = useNavigate()
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const [user, setUser] = React.useState(structuredClone(defaultUser))
  const [validationErrors, setValidationErrors] = React.useState<{
    [key: string]: string
  }>({})
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
    onError: error => {
      hideBackdrop()
      showAlert('Error creating a new user', 'Error', 'error')
    }
  })
  const roles = query.data || []
  const [isFormDataValid, setIsFormDataValid] = React.useState(false)

  const onBasicInfoChange = (event: {user: any; isValid: boolean}) => {
    setUser(event.user)
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
        <Typography variant="h4" gutterBottom fontWeight={400}>
          Add User
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={16}
          gutterBottom
          fontWeight={400}
        >
          Control client systems and their access roles. Add clients to enable
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
    </Box>
  )
}

export default AddUserRole
