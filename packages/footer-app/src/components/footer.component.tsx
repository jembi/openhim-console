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
  const extractedPathName = getDashboardPathName(window.location.href);
  React.useEffect(() => {
  
    if(extractedPathName === "/login"){
      setAbout({serverTimezone:"",currentCoreVersion:"OpenHIM Administration Console Copyright © 2024 Jembi Health Systems NPC Powered by OpenHIM"})
    }else{
      console.log(extractedPathName);
      getAbout().then(setAbout)
    }

  }, [extractedPathName])

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
export const getDashboardPathName = (url) => {
  const hashIndex = url.indexOf('#!');
  if (hashIndex === -1) return null;
  return url.substring(hashIndex + 2); // Get everything after "#!"
};