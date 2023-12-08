import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material'
import {useState, useEffect} from 'react'

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
      const {protocol, host, hostPath, port} = await resConf.json()
      const resMe = await fetch(
        `${protocol}://${host}:${port}${
          /^\s*$/.test(hostPath) ? '' : '/' + hostPath
        }/me`,
        {credentials: 'include'}
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

  return (
    <Box sx={{width: '100%', maxWidth: 250, bgcolor: 'background.paper'}}>
      <List>
      <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/portal">
            <ListItemText primary="Portal" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#!">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/transactions">
            <ListItemText primary="Transaction Log" />
          </ListItemButton>
        </ListItem>
        {isAdmin && (
          <>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/audits">
                <ListItemText primary="Audit Log" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/clients">
                <ListItemText primary="Clients" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/channels">
                <ListItemText primary="Channels" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/tasks">
                <ListItemText primary="Tasks" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/visualizer">
                <ListItemText primary="Visualizer" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/groups">
                <ListItemText primary="Contact Lists" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/mediators">
                <ListItemText primary="Mediators" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/users">
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/certificates">
                <ListItemText primary="Certificates" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/export-import">
                <ListItemText primary="Import/Export" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component="a" href="/#!/logs">
                <ListItemText primary="Server Logs" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton component="a" href="/#!/about">
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )
}
