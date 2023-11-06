import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Link,
  Box,
  Alert
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {Delete} from '@mui/icons-material'
import React from 'react'
import {deleteApp, updateApp} from '../../utils/apiClient'
import ReactDOM from 'react-dom'
import EditNewAppDialog from '../AddAppDialog/EditAppDialog'
import {useRef} from 'react'

const AppCardActionsMenu = ({app}) => {
  const childRef = useRef(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null)
    const target = event.target as HTMLElement
    if (target.id === 'editAppAction') {
      childRef.current.handleClickOpen()
    } else if (target.id === 'deleteAppAction') {
      try {
        deleteApp(app._id)
        const SuccessMessage = (
          <Box paddingBottom={5}>
            <Alert severity="success">App was deleted successfully</Alert>
          </Box>
        )
        ReactDOM.render(SuccessMessage, document.getElementById('alertSection'))
      } catch (error) {
        console.error(error)
        const ErrorMessage = (
          <Box paddingBottom={5}>
            <Alert severity="error">Unable to delete App</Alert>
          </Box>
        )
        ReactDOM.render(ErrorMessage, document.getElementById('alertSection'))
      }
    }
  }

  return (
    <>
      <IconButton aria-label="settings" onClick={handleMenu} sx={{zIndex: 30}}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} id="editAppAction">
          <ListItemIcon>
            <EditNewAppDialog ref={childRef} app={app}></EditNewAppDialog>
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} id="deleteAppAction">
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

export default AppCardActionsMenu
