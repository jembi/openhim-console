import React, {createContext, useContext, useState, ReactNode} from 'react'
import {BasicBackdrop} from '../components/dialogs/basic.backdrop.component'

interface BasicBackdropContextProps {
  showBackdrop: (children: ReactNode, isPersistent: boolean) => void
  hideBackdrop: () => void
}

const BasicBackdropContext = createContext<
  BasicBackdropContextProps | undefined
>(undefined)

export const BasicBackdropProvider: React.FC<{children: ReactNode}> = ({
  children
}) => {
  const [backdropProps, setBackdrop] = useState<{
    children: ReactNode
    open: boolean
    isPersistent: boolean
  }>({
    children: null,
    open: false,
    isPersistent: false
  })

  const showBackdrop = (children: ReactNode, isPersistent: boolean) => {
    setBackdrop({children, open: true, isPersistent})
  }

  const hideBackdrop = () => {
    setBackdrop(prevProps => ({...prevProps, open: false}))
  }

  return (
    <BasicBackdropContext.Provider value={{showBackdrop, hideBackdrop}}>
      {children}
      <BasicBackdrop
        open={backdropProps.open}
        onClose={backdropProps.isPersistent ? undefined : hideBackdrop}
      >
        {backdropProps.children}
      </BasicBackdrop>
    </BasicBackdropContext.Provider>
  )
}

export const useBasicBackdrop = (): BasicBackdropContextProps => {
  const context = useContext(BasicBackdropContext)
  if (!context) {
    throw new Error(
      'useBasicBackdrop must be used within a BasicBackdropProvider'
    )
  }
  return context
}
