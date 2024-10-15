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
  ListItem,
  Box
} from '@mui/material'
import {CustomizeDialogProps} from '../../interfaces/index.interface'

const CustomizeDialog: React.FC<CustomizeDialogProps> = ({
  open,
  onClose,
  onApply,
  visibleFilters,
  handleFilterVisibilityChange,
  onRestoreDefaults,
  isDefaultState
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Customize displayed filters</DialogTitle>
      <DialogContent>
        <List>
          {Object.keys(visibleFilters).map(filter => (
            <ListItem key={filter} sx={{padding: '0px 0px'}}>
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
        <Box sx={{flexGrow: 1}}>
          <Button
            onClick={onRestoreDefaults}
            color="primary"
            disabled={isDefaultState}
          >
            RESTORE DEFAULT
          </Button>
        </Box>
        <Box>
          <Button onClick={onClose} color="primary">
            CANCEL
          </Button>
          <Button onClick={onApply} color="primary">
            APPLY
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default CustomizeDialog
