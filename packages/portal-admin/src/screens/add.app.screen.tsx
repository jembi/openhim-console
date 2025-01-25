import {
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import {BasePageTemplate} from '../../../base-components'
import ActiveStepOne from '../components/ActiveStepOne'
import ActiveStepTwo from '../components/ActiveStepTwo'
import ActiveStepZero from '../components/ActiveStepZero'
import {addApp} from '@jembi/openhim-core-api'
import React from 'react'
import {App} from '../types'
import {useAlert} from '../contexts/alert.context'
import {countdown} from '../components/utils'

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
  const [app, setApp] = React.useState(formInitialState)
  const steps = ['Add App details', 'Add App Configuration', 'Choose Icon']
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set<number>())
  const {showAlert} = useAlert()

  const onAppChange = (event: {app: App; isValid: boolean}) => {}

  const isStepOptional = (step: number) => {
    return step === 2
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const validateData = async () => {
    return true
  }

  const handleNext = async () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    const isValid = await validateData()

    if (isValid) {
      setActiveStep(activeStep + 1)
      setSkipped(newSkipped)
    }

    if (activeStep === 2) {
      setActiveStep(activeStep + 1)
      setSkipped(newSkipped)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const handleAddApp = async data => {
    try {
      data.name = data.name.trim()
      data.description = data.description.trim()
      data.url = data.url.trim()

      await addApp(data)

      //seconds for countdown
      const seconds = 5

      showAlert('App was registered successfully', 'Success', 'success')

      if (app.type === 'esmodule') {
        await countdown(seconds, remainingSeconds =>
          showAlert(
            `The app will have to reload in ${remainingSeconds} seconds.`,
            'Info',
            'info'
          )
        )
        window.location.reload()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        showAlert('App already exists', 'Error', 'error')
      } else {
        showAlert(
          'Failed to add app ! ' + error.response.data?.error,
          'Error',
          'error'
        )
      }
    }
  }

  return (
    <BasePageTemplate
      title="Add App"
      subtitle="Use the form below to add your portal item."
    >
      <Stepper activeStep={activeStep} alternativeLabel sx={{mt: 2}}>
        {steps.map((label, index) => {
          const stepProps: {completed?: boolean} = {}
          const labelProps: {
            optional?: React.ReactNode
          } = {}
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            )
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      return (
      <>
        <Stack spacing={2}>
          {activeStep === 0 && (
            <>
              <ActiveStepZero app={app} onChange={onAppChange} />
            </>
          )}

          {activeStep === 1 && (
            <>
              <ActiveStepOne app={app} onChange={onAppChange} />
            </>
          )}

          {activeStep === 2 && (
            <ActiveStepTwo app={app} onChange={onAppChange} />
          )}

          {activeStep === steps.length && (
            <>
              <Typography
                sx={{
                  mt: 2,
                  mb: 1,
                  alignContent: 'center',
                  textAlign: 'center'
                }}
              >
                All steps completed
              </Typography>
              <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                <Box sx={{flex: '1 1 auto'}} />
                <Button onClick={handleReset} variant="text">
                  Reset
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </>
      )
      {activeStep < steps.length && (
        <>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{mr: 1}}
            variant="outlined"
          >
            Back
          </Button>
          <Box>
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{mr: 1}}>
                Skip
              </Button>
            )}
            {activeStep === steps.length ? (
              <Button form="AppForm" type="submit" variant="contained">
                Confirm
              </Button>
            ) : (
              <Button onClick={handleNext} variant="outlined">
                Continue
              </Button>
            )}

            {activeStep < 2 && (
              <Button onClick={handleAddApp} variant="contained" sx={{ml: 1}}>
                Update
              </Button>
            )}
          </Box>
        </>
      )}
      {/* An empty box outside of the button box is needed to enforce the right position of the box belo */}
      {/* {activeStep === 3 && <Box />}

      {activeStep === 3 && (
        <Box>
          <Button variant="outlined" onClick={handleDialogClose} sx={{mr: 1}}>
            Cancel
          </Button>
          <Button
            form="AppForm"
            type="submit"
            variant="contained"
            onClick={handleApp}
          >
            {openEditDialog ? 'Update' : 'Add App'}
          </Button>
        </Box>
      )} */}
    </BasePageTemplate>
  )
}
