import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {useMutation} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {addChannel} from '../services/api'
import {Channel, Routes} from '../types'
import {BasicInfo} from './steps/BasicInfo'
import {RequestMatching} from './steps/RequestMatching'
import {ChannelRoutes} from './steps/routes/ChannelRoutes'

const steps = ['Basic Info', 'Request Matching', 'Routes']

const defaultChannel: Channel = {
  name: '',
  description: '',
  urlPattern: '',
  isAsynchronousProcess: false,
  methods: [],
  type: 'http',
  tcpHost: '',
  pollingSchedule: '',
  requestBody: false,
  responseBody: false,
  allow: [],
  whitelist: [],
  authType: 'private',
  routes: [],
  matchContentTypes: [],
  matchContentRegex: '',
  matchContentXpath: '',
  matchContentJson: '',
  matchContentValue: '',
  properties: [],
  txViewAcl: [],
  txViewFullAcl: [],
  txRerunAcl: [],
  alerts: [],
  status: 'enabled',
  rewriteUrls: false,
  addAutoRewriteRules: true,
  rewriteUrlsConfig: [],
  autoRetryEnabled: false,
  autoRetryPeriodMinutes: 60
}


function AddChannelScreen() {
  const navigate = useNavigate()
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const [activeStep, setActiveStep] = React.useState(0)
  const [channel, setChannel] = React.useState(structuredClone(defaultChannel))
  const [isFormValid, setIsFormValid] = React.useState(false)
  const mutation = useMutation({
    mutationFn: addChannel,
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
        'Error creating a new channel. ' + error?.response?.data,
        'Error',
        'error'
      )
    }
  })

  const handleAddChannel = () => {
    mutation.mutate(channel)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <Box padding={3} sx={{backgroundColor: '#F1F1F1'}}>
      <header style={{marginBottom: '40px'}}>
        <Typography variant="h4" gutterBottom fontWeight={400}>
          Add Channel
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
          <Paper
            style={{width: '600px', borderRadius: '15px', padding: '20px'}}
            elevation={4}
          >
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
                <BasicInfo
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              )}
              {activeStep === 1 && (
                <RequestMatching
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              )}
              {activeStep === 2 && (
                <ChannelRoutes
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              )}
            </div>

            <Box style={{marginTop: '30px'}}>
              {activeStep === 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(-1)}
                >
                  CANCEL
                </Button>
              )}
              {activeStep > 0 && (
                <Button color="info" variant="contained" onClick={handleBack}>
                  BACK
                </Button>
              )}
              <span style={{marginRight: '10px'}}></span>
              {activeStep != steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={mutation.isLoading || !isFormValid}
                >
                  NEXT
                </Button>
              )}
              {activeStep == steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    mutation.isLoading ||
                    !isFormValid ||
                    JSON.stringify(channel) === JSON.stringify(defaultChannel)
                  }
                  onClick={handleAddChannel}
                >
                  ADD CHANNEL
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddChannelScreen
