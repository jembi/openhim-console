import React, {createContext, useContext, useState, ReactNode} from 'react'
import {
  BasicDialog,
  BasicDialogProps
} from '../components/dialogs/basic.dialog.component'

interface BasicDialogContextProps {
  showBasicDialog: (
    children: ReactNode,
    title?: string,
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
    sx?: BasicDialogProps['sx']
  ) => void
  hideBasicDialog: () => void
}

const BasicDialogContext = createContext<BasicDialogContextProps | undefined>(
  undefined
)

export const BasicDialogProvider: React.FC<{children: ReactNode}> = ({
  children
}) => {
  const [dialogProps, setDialogProps] = useState<{
    title?: string
    children: ReactNode
    open: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    sx?: BasicDialogProps['sx']
  }>({
    title: '',
    children: null,
    open: false,
    size: 'xs',
    sx: undefined
  })

  const showBasicDialog = (
    children: ReactNode,
    title?: string,
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'xs',
    sx?: BasicDialogProps['sx']
  ) => {
    setDialogProps({title, children, open: true, size, sx})
  }

  const hideBasicDialog = () => {
    setDialogProps(prevProps => ({...prevProps, open: false}))
  }

  return (
    <BasicDialogContext.Provider value={{showBasicDialog, hideBasicDialog}}>
      {children}
      <BasicDialog
        title={dialogProps.title}
        open={dialogProps.open}
        onClose={hideBasicDialog}
        size={dialogProps.size}
        sx={dialogProps.sx}
      >
        {dialogProps.children}
      </BasicDialog>
    </BasicDialogContext.Provider>
  )
}

export const useBasicDialog = (): BasicDialogContextProps => {
  const context = useContext(BasicDialogContext)
  if (!context) {
    throw new Error('useBasicDialog must be used within a BasicDialogProvider')
  }
  return context
}
