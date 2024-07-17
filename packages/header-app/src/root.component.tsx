import styled from '@emotion/styled'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { ThemeProvider } from '@mui/material/styles'
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material'
import {
  Divider,
  Drawer,
  IconButton,
  Link,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material'
import React from 'react'
import { OpenHIMMenu } from '@jembi/openhim-sidebar'
import LogoutIcon from '@mui/icons-material/Logout'
import EditIcon from '@mui/icons-material/Edit'
import theme from '@jembi/openhim-theme'
import OpenhimAppBar from './components/openhim.appbar.component'

const GrowingDiv = styled.div`
  flex-grow: 1;
`

export default function ButtonAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '200px' }
        }}
      >
        <OpenHIMMenu></OpenHIMMenu>
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>
        <OpenhimAppBar />
      </Box>
    </ThemeProvider>
  )
}
