import React from 'react'
import {Backdrop} from '@mui/material'

export type BasicBackdropProps = {
  open: boolean
  onClose?: () => unknown
  children: React.ReactNode
}

export function BasicBackdrop(props: BasicBackdropProps) {
  return (
    <Backdrop
      sx={{color: '#fff', zIndex: theme => theme.zIndex.drawer + 1}}
      open={props.open}
      onClick={props.onClose ? props.onClose : undefined}
    >
      {props.children}
    </Backdrop>
  )
}
