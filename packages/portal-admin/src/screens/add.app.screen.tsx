import {addApp} from '@jembi/openhim-core-api'
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
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

export default function AddAppScreen() {
  const [app, setApp] = React.useState(structuredClone(formInitialState))
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isFormValid, setIsFormValid] = React.useState(false)
  const steps = ['Add App details', 'Add App Configuration', 'Choose Icon']
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
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Paper
            style={{width: '680px', borderRadius: '15px', padding: '20px'}}
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
                <ActiveStepZero app={app} onChange={onAppChange} />
              )}
              {activeStep === 1 && (
                <ActiveStepOne app={app} onChange={onAppChange} />
              )}
              {activeStep === 2 && (
                <ActiveStepTwo app={app} onChange={onAppChange} />
              )}
            </div>

            <Box style={{marginTop: '30px'}}>
              {activeStep === 0 && (
                <Button
                  variant="outlined"
                  color="primary"
                  href={`/#${Routes.MANAGE_APPS}`}
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
                  disabled={isSubmitting || !isFormValid}
                >
                  NEXT
                </Button>
              )}
              {activeStep == steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    isSubmitting ||
                    !isFormValid ||
                    JSON.stringify(app) === JSON.stringify(formInitialState)
                  }
                  onClick={handleAddApp}
                >
                  ADD APP
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </BasePageTemplate>
  )
}
