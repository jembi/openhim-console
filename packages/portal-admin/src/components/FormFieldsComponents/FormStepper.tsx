import React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormFields from './FormFields'
import {StepperProvider} from './StepperContext'
import {useState} from 'react'

const steps = ['Add App details', 'Add App Configuration', 'Choose Icon']
export default function HorizontalLinearStepper({activeStep, setActiveStep}) {
  const [skipped, setSkipped] = useState(new Set<number>())

  const isStepOptional = (step: number) => {
    return step === 2
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    setActiveStep(activeStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
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

  return (
    <Box sx={{width: '100%'}}>
      <Stepper activeStep={activeStep} alternativeLabel>
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
      {activeStep === steps.length ? (
        <>
          <Typography
            sx={{mt: 2, mb: 1, alignContent: 'center', textAlign: 'center'}}
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
      ) : (
        <>
          <StepperProvider value={{activeStep}}>
            <FormFields currentStep={activeStep} />
          </StepperProvider>
          <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{mr: 1}}
              variant="outlined"
            >
              Back
            </Button>
            <Box sx={{flex: '1 1 auto'}} />
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
          </Box>
        </>
      )}
    </Box>
  )
}
