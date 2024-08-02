import React, {createContext, useContext, useState, ReactNode} from 'react'
import {ConfirmationDialog} from '../components/dialogs/confirmation.dialog.component'

interface ConfirmationContextProps {
  showConfirmation: (
    message: string,
    title: string,
    onYes: () => unknown,
    onNo?: () => unknown,
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  ) => void
  hideConfirmation: () => void
}

const ConfirmationContext = createContext<ConfirmationContextProps | undefined>(
  undefined
)

export const ConfirmationProvider: React.FC<{children: ReactNode}> = ({
  children
}) => {
  const [dialogProps, setDialogProps] = useState<{
    message: string
    title: string
    onYes: () => unknown
    onNo: () => unknown
    open: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }>({
    message: '',
    title: '',
    onYes: () => {},
    onNo: () => {},
    open: false,
    size: 'sm'
  })

  const showConfirmation = (
    message: string,
    title: string,
    onYes: () => unknown,
    onNo: () => unknown = () => {},
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'sm'
  ) => {
    setDialogProps({message, title, onYes, onNo, open: true, size})
  }

  const hideConfirmation = () => {
    setDialogProps(prevProps => ({...prevProps, open: false}))
  }

  return (
    <ConfirmationContext.Provider value={{showConfirmation, hideConfirmation}}>
      {children}
      <ConfirmationDialog
        message={dialogProps.message}
        title={dialogProps.title}
        onYes={() => {
          dialogProps.onYes()
          hideConfirmation()
        }}
        onNo={() => {
          dialogProps.onNo()
          hideConfirmation()
        }}
        open={dialogProps.open}
        size={dialogProps.size}
      />
    </ConfirmationContext.Provider>
  )
}

export const useConfirmation = (): ConfirmationContextProps => {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error(
      'useConfirmation must be used within a ConfirmationDialogProvider'
    )
  }
  return context
}
