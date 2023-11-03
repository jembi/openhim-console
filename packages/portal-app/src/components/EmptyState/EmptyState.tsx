import {Box, Typography} from '@mui/material'
import React from 'react'
import InfoIcon from '@mui/icons-material/Info'

interface EmptyStateProps {
  header: string
  description: string
}

const EmptyState: React.FC<EmptyStateProps> = ({header, description}) => {
  return (
    <Box justifyContent="center" alignItems="center" height="100vh">
      <Typography align="center" variant="h1">
        <InfoIcon fontSize="large" color="info" />
      </Typography>
      <Typography variant="h5" align="center">
        {header}
      </Typography>
      <Typography variant="subtitle1" align="center">
        {description}
      </Typography>
    </Box>
  )
}

export default EmptyState
