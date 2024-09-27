import CloseIcon from '@mui/icons-material/Close'
import {Box, Button, Checkbox, FormControlLabel, Stack} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import {Transaction} from '../../types'

export interface TransactionRerunEvent {
  batchSize: string
  paused: boolean
}

export interface TransactionRerunProps {
  open: boolean
  selectedTransactions: Transaction[]
  transactions: Transaction[]
  onConfirmReRun: (event: TransactionRerunEvent) => unknown
  onClose?: () => unknown
}

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

export const ReRunTransactionsConfirmationDialog: React.FC<
  TransactionRerunProps
> = (props: TransactionRerunProps) => {
  const [event, setEvent] = React.useState<TransactionRerunEvent>({
    batchSize: '1',
    paused: false
  })

  return (
    <React.Fragment>
      <BootstrapDialog onClose={props.onClose} open={props.open}>
        <DialogTitle sx={{m: 0, p: 2}}>
          Transaction Rerun Confirmation
        </DialogTitle>
        <IconButton
          onClick={props.onClose}
          sx={theme => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box p={0}>
            {props.selectedTransactions.length > 0 && (
              <Typography>
                You have selected that transaction{' '}
                <strong>{props.selectedTransactions[0]?._id || ''}</strong>{' '}
                should be rerun.
              </Typography>
            )}
            <Typography>
              You have selected a total of {props.selectedTransactions.length}{' '}
              transaction(s) to be rerun.
            </Typography>
            <Typography mt={2}>
              Are you sure you wish to proceed with this operation?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack
            direction={{xs: 'column', sm: 'row'}}
            sx={{justifyContent: 'space-between', gap: 2}}
          >
            <Box
              sx={{
                flexShrink: 1,
                alignSelf: {xs: 'flex-start', sm: 'center'}
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={event.paused}
                    onChange={e =>
                      setEvent({...event, paused: e.target.checked})
                    }
                  />
                }
                label="Paused"
              />
            </Box>
            <Stack
              direction={{
                xs: 'row-reverse',
                sm: 'row'
              }}
              sx={{
                gap: 2,
                flexShrink: 0,
                alignSelf: {xs: 'flex-end', sm: 'center'}
              }}
            >
              <Button
                autoFocus
                size="small"
                color="secondary"
                variant="contained"
                onClick={props.onClose}
              >
                Close
              </Button>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={() => props.onConfirmReRun(event)}
              >
                Confirm Batch Rerun
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  )
}
