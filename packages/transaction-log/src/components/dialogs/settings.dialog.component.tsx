import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  List,
  ListItem
} from '@mui/material'
import {SettingsDialogProps} from '../../interfaces/index.interface'

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  onApply,
  openInNewTab,
  setOpenInNewTab,
  autoUpdate,
  setAutoUpdate
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h6">Set the transaction list behaviour</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={openInNewTab}
                  onChange={e => setOpenInNewTab(e.target.checked)}
                />
              }
              label="Open transactions in a new tab"
            />
          </ListItem>
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={autoUpdate}
                  onChange={e => setAutoUpdate(e.target.checked)}
                />
              }
              label="Auto-update transaction list with new entries"
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          CANCEL
        </Button>
        <Button onClick={onApply} color="primary">
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDialog
