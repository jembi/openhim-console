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

  return (
    <Box sx={{ width: '100%', maxWidth: 250, bgcolor: 'background.paper' }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/portal">
            <Typography sx={{ fontSize: customFontSize }}>
              Portal
            </Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/dashboard">
            <Typography sx={{ fontSize: customFontSize }}>
              Dashboard
            </Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/transactionsxyz">
            <Typography sx={{ fontSize: customFontSize }}>
              Transaction Log
            </Typography>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/transactions">
            <Typography sx={{ fontSize: customFontSize }}>
              Transaction Log old
            </Typography>
          </ListItemButton>
        </ListItem>
        {isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/audits">
                <Typography sx={{ fontSize: customFontSize }}>
                  Audit Log
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/clients">
                <Typography sx={{ fontSize: customFontSize }}>
                  Clients
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/channels">
                <Typography sx={{ fontSize: customFontSize }}>
                  Channels
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/tasks">
                <Typography sx={{ fontSize: customFontSize }}>
                  Tasks
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/visualizer">
                <Typography sx={{ fontSize: customFontSize }}>
                  Visualizer
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/groups">
                <Typography sx={{ fontSize: customFontSize }}>
                  Contact Lists
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/mediators">
                <Typography sx={{ fontSize: customFontSize }}>
                  Mediators
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/users">
                <Typography sx={{ fontSize: customFontSize }}>
                  Users
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/certificates">
                <Typography sx={{ fontSize: customFontSize }}>
                  Certificates
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/export-import">
                <Typography sx={{ fontSize: customFontSize }}>
                  Import/Export
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/logs">
                <Typography sx={{ fontSize: customFontSize }}>
                  Server Logs
                </Typography>
              </ListItemButton>
            </ListItem>
          </>
        )}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/about">
            <Typography sx={{ fontSize: customFontSize }}>
              About
            </Typography>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )
}
