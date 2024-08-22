import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography
} from '@mui/material'
import Tab from '@mui/material/Tab'
import {makeStyles} from '@mui/styles'
import {useMutation} from '@tanstack/react-query'
import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {modifyChannel} from '../services/api'
import {Channel, Routes} from '../types'
import {BasicInfo} from './steps/BasicInfo'
import {RequestMatching} from './steps/RequestMatching'
import {ChannelRoutes} from './steps/routes/ChannelRoutes'

const useStyles = makeStyles(_theme => ({
  mainCard: {
    width: '600px',
    borderRadius: '15px'
  },
  header: {
    marginBottom: '40px'
  },
  cardActions: {
    padding: '10px'
  },
  cardActionsBtnGap: {
    marginRight: '10px'
  }
}))

function EditChannelScreen() {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const originalChannel = location.state as Channel
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const [activeTab, setActiveTab] = React.useState('0')
  const [isFormValid, setIsFormValid] = React.useState(false)
  const [channel, setChannel] = React.useState(structuredClone(originalChannel))
  const mutation = useMutation({
    mutationFn: modifyChannel,
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      navigate(Routes.MANAGE_CHANNELS)
    },
    onError: (error: any) => {
      console.error(error)
      hideBackdrop()
      showAlert(
        'Error editing channel. ' + error?.response?.data,
        'Error',
        'error'
      )
    }
  })

  const handleEditChannel = () => {
    mutation.mutate(channel)
  }

  return (
    <Box padding={1} sx={{backgroundColor: '#F1F1F1'}}>
      <header className={classes.header}>
        <Typography variant="h4" gutterBottom fontWeight={400}>
          Edit Channel
        </Typography>
        <Typography
          variant="subtitle1"
          fontSize={16}
          gutterBottom
          fontWeight={400}
        >
          Control client systems and their access roles. Add clients to enable
          their request routing and group them by roles for streamlined channel
          accesss managment.
        </Typography>
      </header>

      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Paper className={classes.mainCard} elevation={4}>
            <TabContext value={activeTab}>
              <TabList
                onChange={(e, newValue) => setActiveTab(newValue)}
                centered
                variant="fullWidth"
              >
                <Tab label="Basic Info" value="0" />
                <Tab label="Request Matching" value="1" />
                <Tab label="Routes" value="2" />
              </TabList>
              <TabPanel value="0">
                <BasicInfo
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              </TabPanel>
              <TabPanel value="1">
                <RequestMatching
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              </TabPanel>
              <TabPanel value="2">
                <ChannelRoutes
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              </TabPanel>
            </TabContext>

            <Box className={classes.cardActions}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
              >
                CANCEL
              </Button>

              <span className={classes.cardActionsBtnGap}></span>

              <Button
                variant="contained"
                color="primary"
                disabled={
                  mutation.isLoading ||
                  !isFormValid ||
                  JSON.stringify(channel) === JSON.stringify(originalChannel)
                }
                onClick={handleEditChannel}
              >
                SAVE
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EditChannelScreen