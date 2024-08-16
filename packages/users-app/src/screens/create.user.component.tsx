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
import {makeStyles} from '@mui/styles'
import {useMutation, useQuery} from '@tanstack/react-query'
import React from 'react'
//import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {createNewUser, getRoles} from '../services/api'
import {Routes} from '../types'
import {defaultUser} from '../utils'
import {BasicInfo} from '../components/common/basic.info.component'

const useStyles = makeStyles(_theme => ({
  box: {
    backgroundColor: '#F1F1F1'
  },
  mainCard: {
    width: '600px'
  },
  boxHeader: {marginBottom: '40px'},
  cardActionsGap: {marginRight: '10px'}
}))

function AddUserRole() {
  const classes = useStyles()
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
      window.history.pushState({}, '', '/#!/users')
      //navigate(Routes.USERS)
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
    <Box padding={3} className={classes.box}>
      <header className={classes.boxHeader}>
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
          <Card className={classes.mainCard} elevation={4}>
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
                  onClick={() => window.history.pushState({}, '', '/#!/users')}
                >
                  Cancel
                </Button>

                <span className={classes.cardActionsGap}></span>

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
