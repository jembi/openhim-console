import React from 'react'
import {Button} from '@mui/material'
import {StatusButtonProps} from '../../interfaces/index.interface'

const StatusButton: React.FC<StatusButtonProps> = ({status, buttonText}) => {
  const buttonColor =
    status === 'Processing'
      ? 'info'
      : status === 'Pending Async'
      ? 'info'
      : status === 'Successful'
      ? 'success'
      : status === 'Completed'
      ? 'warning'
      : status === 'Completed with error(s)'
      ? 'warning'
      : 'error'

  return (
    <Button size="small" variant="text" color={buttonColor}>
      {buttonText}
    </Button>
  )
}

export default StatusButton
