import {Typography} from '@mui/material'
import React from 'react'
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
    <Typography fontSize={14} color={buttonColor}>
      {buttonText}
    </Typography>
  )
}

export default StatusButton
