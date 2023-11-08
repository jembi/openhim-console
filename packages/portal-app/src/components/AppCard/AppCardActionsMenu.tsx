import {IconButton, ListItemIcon, Menu, MenuItem, Link} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {Delete} from '@mui/icons-material'
import React from 'react'
import {deleteApp} from '../../utils/apiClient'
import EditNewAppDialog from '../AddAppDialog/EditAppDialog'
import {useRef} from 'react'
import {useSnackbar} from 'notistack'

const AppCardActionsMenu = ({app}) => {
  /* Alert - Snackbar */
  const {enqueueSnackbar} = useSnackbar()

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
        enqueueSnackbar('App was deleted successfully', {variant: 'success'})
      } catch (error) {
        console.error(error)
        enqueueSnackbar('Unable to delete App', {variant: 'error'})
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
            <EditNewAppDialog ref={childRef} app={app} />
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
