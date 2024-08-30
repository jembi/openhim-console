import React from 'react'
import {Box, Button, Typography} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export type ErrorMessageProps = {
  onRetry?: () => unknown
  title?: string
  message?: string
}

export function ErrorMessage({onRetry, title, message}: ErrorMessageProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="300px"
      padding={2}
    >
      <ErrorOutlineIcon color="error" sx={{fontSize: 60}} />
      <Typography variant="h6" color="error" align="center" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        An error occurred while loading the data. Please try again.
      </Typography>
      <Button variant="contained" color="primary" onClick={onRetry}>
        Retry
      </Button>
    </Box>
  )
}
