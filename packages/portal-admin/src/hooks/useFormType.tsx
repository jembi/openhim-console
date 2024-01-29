import React, { useState } from 'react'

export type ModuleTypes = "internal" | "esmodule" | "external"

interface FromProps {
    typeCheck: ModuleTypes
    setTypeCheck: React.Dispatch<React.SetStateAction<ModuleTypes>>
    activeStep: number
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}
const FormContext = React.createContext<FromProps | null>(null)
FormContext.displayName = 'FormContext'

export interface FormProviderProps {
    children: React.ReactNode
}

export const FormStateProvider = ({
    children
}: FormProviderProps): JSX.Element => {
    const [typeCheck, setTypeCheck] = useState<ModuleTypes>("internal")
    const [activeStep, setActiveStep] = useState(0)

    return (
        <FormContext.Provider
            value={{
                typeCheck,
                setTypeCheck,
                activeStep,
                setActiveStep
            }}
        >
            {children}
        </FormContext.Provider>
    )
}

export const useFromState = () => {
    const context = React.useContext(FormContext)
    if (!context) {
        throw new Error(`useFromState must be used within an FormStateProvider`)
    }
    return context
}
