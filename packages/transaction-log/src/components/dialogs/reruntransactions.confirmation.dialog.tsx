import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import {Transaction} from '../../types'

export interface TransactionRerunEvent {
  batchSize: number
  paused: boolean
}

export interface TransactionRerunProps {
  open: boolean
  bulkReRunFilterCount?: number
  selectedTransactions?: Readonly<Transaction[]>
  transactions?: Readonly<Transaction[]>
  onConfirmReRun: (event: TransactionRerunEvent) => unknown
  onClose?: () => unknown
}

const MAX_BATCH_SIZE = 65

function getBatchSizes(currentBatchSize: number) {
  const batches = [{value: 1, label: 'One at a time'}]

  for (
    let currentValue = 1;
    currentValue <= Math.min(currentBatchSize, MAX_BATCH_SIZE);
    currentValue *= 2
  ) {
    batches.push({value: currentValue, label: `${currentValue} at a time`})
  }

  return batches
}

export const ReRunTransactionsConfirmationDialog: React.FC<
  TransactionRerunProps
> = (props: TransactionRerunProps) => {
  const [event, setEvent] = React.useState<TransactionRerunEvent>({
    batchSize: 1,
    paused: false
  })

  return (
    <div>
      <Dialog fullWidth onClose={props.onClose} open={props.open}>
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
          {props.bulkReRunFilterCount >= 0 && (
            <Box p={0}>
              <Typography>
                You have selected a total of {props.bulkReRunFilterCount}{' '}
                transaction(s) to be rerun.
              </Typography>
              <Typography mt={2}>
                Are you sure you wish to proceed with this operation?
              </Typography>
            </Box>
          )}

          {props.bulkReRunFilterCount === undefined && (
            <Box p={0}>
              {props.selectedTransactions?.length === 1 && (
                <Typography mb={2}>
                  You have selected that transaction{' '}
                  <strong>{props.selectedTransactions?.[0]?._id || ''}</strong>{' '}
                  should be rerun.
                </Typography>
              )}
              <Typography>
                You have selected a total of{' '}
                {props.selectedTransactions?.length} transaction(s) to be rerun.
              </Typography>
              <Typography mt={2}>
                Are you sure you wish to proceed with this operation?
              </Typography>
            </Box>
          )}

          <Stack
            direction="row"
            sx={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 2,
              flexGrow: 1,
              marginTop: 2
            }}
          >
            <FormControl size="small" fullWidth margin="none">
              <InputLabel>Batch size</InputLabel>
              <Select
                label="Batch size"
                variant="outlined"
                onChange={e => setEvent({...event, batchSize: +e.target.value})}
              >
                {getBatchSizes(
                  props.bulkReRunFilterCount ||
                    props.selectedTransactions?.length
                ).map((b, i) => (
                  <MenuItem key={i} value={b.value}>
                    {b.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={event.paused}
                  onChange={e => setEvent({...event, paused: e.target.checked})}
                />
              }
              label="Paused"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
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
              color="primary"
              variant="outlined"
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
        </DialogActions>
      </Dialog>
    </div>
  )
}
