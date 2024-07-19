import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react'

export default function OpenHIMMenu() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function fetchMe() {
      const resConf = await fetch('/config/default.json')
      if (!resConf.ok) {
        return console.error(
          '[sidebar-app] Failed to fetch OpenHIM console config'
        )
      }
      const { protocol, host, hostPath, port } = await resConf.json()
      const resMe = await fetch(
        `${protocol}://${host}:${port}${/^\s*$/.test(hostPath) ? '' : '/' + hostPath
        }/me`,
        { credentials: 'include' }
      )
      if (!resMe.ok) {
        return console.error('[sidebar-app] Failed to fetch user profile')
      }
      const me = await resMe.json()

      setIsAdmin(me.user.groups.includes('admin'))
    }

    if (!location.href.includes('#!/login')) {
      fetchMe()
    }
  })

  const customFontSize = 16

  return null
}
