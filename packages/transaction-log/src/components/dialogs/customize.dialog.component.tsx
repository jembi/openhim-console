import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  List,
  ListItem
} from '@mui/material'
import {CustomizeDialogProps} from '../../interfaces/index.interface'

const CustomizeDialog: React.FC<CustomizeDialogProps> = ({
  open,
  onClose,
  onApply,
  visibleFilters,
  handleFilterVisibilityChange
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Customize displayed filters</DialogTitle>
      <DialogContent>
        <List>
          {Object.keys(visibleFilters).map(filter => (
            <ListItem key={filter}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      visibleFilters[filter as keyof typeof visibleFilters]
                    }
                    onChange={handleFilterVisibilityChange}
                    name={filter}
                  />
                }
                label={filter.charAt(0).toUpperCase() + filter.slice(1)}
              />
            </ListItem>
          ))}
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

export default CustomizeDialog
