import {Box, Typography} from '@mui/material'
import {makeStyles} from '@mui/styles'
import {AboutResponse} from '../types'
import React from 'react'
import {getAbout} from '../services/api'

export function Footer() {
  const [about, setAbout] = React.useState<AboutResponse | null>(null)

  const isLoggedIn =
    !window.location.href.includes('#!/login') &&
    !window.location.href.includes('#!/logout')

  React.useEffect(() => {
    const loadEvent = () => {
      if (!isLoggedIn) {
        return
      }

      getAbout()
        .then(setAbout)
        .catch(err => setAbout(null))
    }

    window.addEventListener('popstate', loadEvent)
    loadEvent()

    return () => {
      window.removeEventListener('popstate', loadEvent)
    }
  }, [])

  return (
    <Box style={{ backgroundColor: '#F1F1F1',
      padding: 10,
      textAlign: 'center'}}>
      {about?.currentCoreVersion && (
        <Typography
          color={'grey'}
          fontSize={14}
          fontWeight={400}
          variant="body2"
        >
          OpenHIM v{about.currentCoreVersion}
          <br />
          Community-driven, powered by Jembi
        </Typography>
      )}
      {!about?.currentCoreVersion && (
        <Typography
          color={'grey'}
          fontSize={14}
          fontWeight={400}
          variant="body2"
        >
          OpenHIM Administration Console
          <br />
          Copyright © {new Date().getFullYear()} Jembi Health Systems NPC
          Powered by OpenHIM
        </Typography>
      )}
    </Box>
  )
}
