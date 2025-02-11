import {addApp} from '@jembi/openhim-core-api'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Step,
  StepLabel,
  Stepper
} from '@mui/material'
import React from 'react'
import {BasePageTemplate} from '../../../base-components'
import {useAlert} from '../contexts/alert.context'
import {App, Routes} from '../types'
import ActiveStepOne from './steps/ActiveStepOne'
import ActiveStepTwo from './steps/ActiveStepTwo'
import ActiveStepZero from './steps/ActiveStepZero'

const formInitialState: App = {
  _id: '',
  name: '',
  description: '',
  url: '',
  type: 'esmodule',
  icon: '',
  access_roles: [],
  category: '',
  showInPortal: false,
  showInSideBar: false
}

const steps = ['Add App Details', 'Add App Configuration', 'Choose Icon']

export default function AddAppScreen() {
  const [app, setApp] = React.useState(structuredClone(formInitialState))
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isFormValid, setIsFormValid] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(0)
  const {showAlert} = useAlert()

  const onAppChange = (event: {app: App; isValid: boolean}) => {
    setApp(event.app)
    setIsFormValid(event.isValid)
  }

  const handleNext = async () => {
    setActiveStep(currStep => currStep + 1)
  }

  const handleBack = () => {
    setActiveStep(currStep => currStep - 1)
  }

  const handleAddApp = async () => {
    try {
      setIsSubmitting(true)
      await addApp({...app, _id: undefined})
      showAlert('App was registered successfully', 'Success', 'success')
      setTimeout(() => {
        window.location.href = `/#${Routes.MANAGE_APPS}`
      }, 500)
    } catch (error) {
      console.error(error)
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        showAlert('App already exists', 'Error', 'error')
      } else {
        showAlert(
          'Failed to add app ! ' + error.response?.data?.error,
          'Error',
          'error'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BasePageTemplate
      title="Add App"
      subtitle="Use the form below to add your portal item."
      breadcrumbs={[{label: 'Apps', href: '/#!/apps'}, {label: 'Add'}]}
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
                  title="Add App Details"
                  subheader="Enter the basic information about your app"
                />
              )}
              {activeStep === 1 && (
                <CardHeader
                  title="Add App Configuration"
                  subheader="Configure the app settings and permissions"
                />
              )}
              {activeStep === 2 && (
                <CardHeader
                  title="Choose Icon"
                  subheader="Select an icon for your app"
                />
              )}
              
              <Divider />
              
              <CardContent>
                {activeStep === 0 && (
                  <ActiveStepZero app={app} onChange={onAppChange} />
                )}
                {activeStep === 1 && (
                  <ActiveStepOne app={app} onChange={onAppChange} />
                )}
                {activeStep === 2 && (
                  <ActiveStepTwo app={app} onChange={onAppChange} />
                )}
              </CardContent>

              <Divider />
              
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
                    href={`/#${Routes.MANAGE_APPS}`}
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
                  onClick={activeStep === steps.length - 1 ? handleAddApp : handleNext}
                  disabled={
                    isSubmitting || 
                    !isFormValid || 
                    (activeStep === steps.length - 1 && 
                      JSON.stringify(app) === JSON.stringify(formInitialState))
                  }
                >
                  {activeStep === steps.length - 1 ? 'ADD APP' : 'NEXT'}
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </BasePageTemplate>
  )
}
