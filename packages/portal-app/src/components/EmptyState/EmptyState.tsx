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
      <Typography align="center">
        <InfoIcon color="info" />
      </Typography>
      <Typography align="center">{header}</Typography>
      <Typography align="center">{description}</Typography>
    </Box>
  )
}

export default EmptyState
