import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions
} from '@mui/material'
import {useMutation} from '@tanstack/react-query'
import React from 'react'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {addChannel} from '../services/api'
import {Channel, Routes} from '../types'
import {BasicInfo} from './steps/BasicInfo'
import {RequestMatching} from './steps/RequestMatching'
import {ChannelRoutes} from './steps/routes/ChannelRoutes'
import {BasePageTemplate} from '../../../base-components'

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
      window.location.href = `/#${Routes.MANAGE_CHANNELS}`
    },
    onError: (error: any) => {
      const err = error?.response?.data ?? 'An unexpected error occurred'
      console.error(error)
      hideBackdrop()
      showAlert('Error creating a new channel. ' + err, 'Error', 'error')
    }
  })

  const handleAddChannel = () => {
    const numOfPrimaryRoutes = channel.routes?.filter(
      route => !!route.primary
    ).length

    if (numOfPrimaryRoutes !== 1) {
      showAlert(
        'Channel must have exactly only 1 primary route.',
        'Error',
        'error'
      )
      return
    }

    mutation.mutate(channel)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <BasePageTemplate
      title="Add Channel"
      subtitle="Control client systems and their access roles. Add clients to enable their request routing and group them by roles for streamlined channel accesss managment."
    >
      <Grid container direction="column">
        {/* Stepper Section */}
        <Grid item xs={12}>
          <Box sx={{ 
            width: '100%', 
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Box sx={{
              width: '800px',
              height: '56px',
              background: '#FFFFFF',
              boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.2)',
              borderRadius: '16px 16px 0px 0px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: 0,
            }}>
              <Stepper 
                activeStep={activeStep}
                sx={{
                  width: '100%',
                  padding: '16px',
                  '& .MuiStepLabel-root .Mui-active': {
                    color: '#007F68',
                  },
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: '#007F68',
                  },
                  '& .MuiStepConnector-line': {
                    borderColor: '#E0E0E0',
                  },
                  '& .MuiStepLabel-label': {
                    fontSize: '14px',
                    fontWeight: 500,
                  }
                }}
              >
                {steps.map(label => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
        </Grid>

        {/* Main Card Section */}
        <Grid item xs={12}>
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Card sx={{ 
              width: '800px',
              borderRadius: '0px 0px 8px 8px',
              boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.12), 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.2)',
            }}>
              {/* Dynamic Card Header based on active step */}
              {activeStep === 0 && (
                <CardHeader
                  title="Basic Info"
                  subheader="Describe some basic information about the channel and choose its overall type."
                />
              )}
              {activeStep === 1 && (
                <CardHeader
                  title="Request Matching"
                  subheader="Set criteria for requests to be forwarded to this channel."
                />
              )}
              {activeStep === 2 && (
                <CardHeader
                  title="Channel Routes"
                  subheader="Configure the routes for this channel."
                />
              )}
              
              <Divider />
              
              {/* Dynamic Card Content based on active step */}
              <CardContent>
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
              </CardContent>

              <Divider />
              
              {/* Card Actions with Buttons */}
              <CardActions sx={{ p: 2, justifyContent: 'flex-start' }}>
                {activeStep === 0 ? (
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#007F68',
                      borderColor: '#007F68',
                      '&:hover': {
                        borderColor: '#006D5A',
                        backgroundColor: 'rgba(0, 127, 104, 0.04)'
                      }
                    }}
                    href={`/#${Routes.MANAGE_CHANNELS}`}
                  >
                    CANCEL
                  </Button>
                ) : (
                  <Button 
                    variant="outlined"
                    sx={{
                      color: '#007F68',
                      borderColor: '#007F68',
                      '&:hover': {
                        borderColor: '#006D5A',
                        backgroundColor: 'rgba(0, 127, 104, 0.04)'
                      }
                    }}
                    onClick={handleBack}
                  >
                    BACK
                  </Button>
                )}
                <span style={{marginRight: '10px'}}></span>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#007F68',
                    '&:hover': {
                      backgroundColor: '#006D5A'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(0, 127, 104, 0.12)',
                      color: 'rgba(0, 127, 104, 0.38)'
                    }
                  }}
                  onClick={activeStep === steps.length - 1 ? handleAddChannel : handleNext}
                  disabled={
                    mutation.isLoading || 
                    !isFormValid || 
                    (activeStep === steps.length - 1 && 
                      JSON.stringify(channel) === JSON.stringify(defaultChannel))
                  }
                >
                  {activeStep === steps.length - 1 ? 'ADD CHANNEL' : 'NEXT'}
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </BasePageTemplate>
  )
}

export default AddChannelScreen
