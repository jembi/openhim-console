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
import {useNavigate, useLocation} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {createNewUser, editUserByEmail, getRoles} from '../services/api'
import {Routes, User} from '../types'
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

function AddUserRole({editUser}) {
  const classes = useStyles()
  //const location = useLocation()
  //const navigate = useNavigate()
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const originalUser = structuredClone(editUser)
  const [user, setUser] = React.useState(structuredClone(originalUser))
  
  const getRolesQuery = useQuery(['AddUserRole.getRolesQuery'], getRoles)
  const mutation = useMutation({
    mutationFn: async () => editUserByEmail(originalUser.email, user),
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      window.history.pushState({}, '', '/#!/users')
    },
    onError: error => {
      hideBackdrop()
      showAlert('Error editing user', 'Error', 'error')
    }
  })
  const roles = getRolesQuery.data || []
  const [isFormDataValid, setIsFormDataValid] = React.useState(false)

  const onBasicInfoChange = (event: {user: any; isValid: boolean}) => {
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
    <Box padding={3} className={classes.box}>
      <header className={classes.boxHeader}>
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
                  CANCEL
                </Button>

                <span className={classes.cardActionsGap}></span>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    mutation.isLoading ||
                    !isFormDataValid ||
                    JSON.stringify(user) === JSON.stringify(originalUser)
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
