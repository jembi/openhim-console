import React, {useEffect, useState} from 'react'
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
  const [localOpenInNewTab, setLocalOpenInNewTab] = useState(openInNewTab)
  const [localAutoUpdate, setLocalAutoUpdate] = useState(autoUpdate)

  useEffect(() => {
    setLocalOpenInNewTab(openInNewTab)
    setLocalAutoUpdate(autoUpdate)
  }, [open, openInNewTab, autoUpdate])

  const handleApply = () => {
    setOpenInNewTab(localOpenInNewTab)
    setAutoUpdate(localAutoUpdate)
    onApply()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h6">Set the transaction list behaviour</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={localOpenInNewTab}
                  onChange={e => setLocalOpenInNewTab(e.target.checked)}
                />
              }
              label="Open transactions in a new tab"
            />
          </ListItem>
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={localAutoUpdate}
                  onChange={e => setLocalAutoUpdate(e.target.checked)}
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
        <Button onClick={handleApply} color="primary">
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsDialog
