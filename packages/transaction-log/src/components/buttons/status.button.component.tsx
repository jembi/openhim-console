import React from 'react'
import {Button, Chip} from '@mui/material'
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
      ? 'success'
      : status === 'Completed with error(s)'
      ? 'warning'
      : 'error'

  return <Chip size="small" color={buttonColor} label={buttonText} />
}

export default StatusButton
