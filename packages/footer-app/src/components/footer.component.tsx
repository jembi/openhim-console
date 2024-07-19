import {Box, Typography} from '@mui/material'
import {makeStyles} from '@mui/styles'
import { AboutResponse } from '../types'
import React from 'react'
import { getAbout } from '../services/api'

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: '#F1F1F1',
    padding: 10,
    textAlign: 'center'
  }
}))

export function Footer() {
  const [about, setAbout] = React.useState<AboutResponse | null>(null)
  const classes = useStyles()

  React.useEffect(() => {
    getAbout().then(setAbout)
  }, [])

  return (
    <Box className={classes.footer}>
      <Typography color={'grey'} fontSize={14} fontWeight={400} variant="body2">
        OpenHIM v{about?.currentCoreVersion ?? '???'}
        <br />
        Community-driven, powered by Jembi
      </Typography>
    </Box>
  )
}