import React from 'react'
import {DialogTitle, Dialog, DialogContent, DialogProps} from '@mui/material'

export type BasicDialogProps = {
  title?: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
  size?: DialogProps['maxWidth']
  defaultContentWrapper?: boolean
  sx?: DialogProps['sx']
}

export function BasicDialog(props: BasicDialogProps) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth={props.size ?? 'lg'}
      sx={props.sx}
    >
      {props.title && <DialogTitle>{props.title}</DialogTitle>}
      <DialogContent>{props.children}</DialogContent>
    </Dialog>
  )
}
