import React from 'react'

interface StepperContextValue {
  activeStep: number | null
  setActiveStep?: React.Dispatch<React.SetStateAction<number | null>>
}

const StepperContext = React.createContext<StepperContextValue | undefined>(
  undefined
)

export const StepperConsumer = StepperContext.Consumer
export const StepperProvider = StepperContext.Provider
