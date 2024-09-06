import React from 'react'
import {
  Modal,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material'

interface Batch {
  value: number
  label: string
}

interface Props {
  open: boolean
  handleClose: () => void
  rerunSuccess: boolean | undefined
  transactionsSelected: number[]
  transactionsCount: number
  alerts: {rerun: {type?: string; msg: string}[]}
  bulkRerunActive: boolean
  batchSizes: Batch[]
  taskSetup: {batchSize: number; paused: boolean}
  setTaskSetup: React.Dispatch<
    React.SetStateAction<{batchSize: number; paused: boolean}>
  >
  confirmRerun: () => void
}

const RerunTransactionsConfirmationModal: React.FC<Props> = ({
  open,
  handleClose,
  rerunSuccess,
  transactionsSelected,
  transactionsCount,
  alerts,
  bulkRerunActive,
  batchSizes,
  taskSetup,
  setTaskSetup,
  confirmRerun
}) => {
  const handleBatchSizeChange = (
    event: React.ChangeEvent<{value: unknown}>
  ) => {
    setTaskSetup(prevState => ({
      ...prevState,
      batchSize: event.target.value as number
    }))
  }

  const handlePausedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskSetup(prevState => ({
      ...prevState,
      paused: event.target.checked
    }))
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          padding: 3,
          bgcolor: 'background.paper',
          margin: 'auto',
          mt: 10
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="h6" component="div">
            <i className="glyphicon glyphicon-repeat"></i>
            &nbsp;&nbsp;Transactions Rerun Confirmation
          </Typography>
          <Button onClick={handleClose}>&times;</Button>
        </Box>
        <Box sx={{mb: 2}}>
          {!rerunSuccess ? (
            <>
              {transactionsSelected.length === 0 && transactionsCount === 0 ? (
                <Typography variant="h6">
                  You have not selected any transactions to be rerun. <br />
                  <br />
                  Please select the transactions you wish to rerun by ticking
                  the boxes on the left and try again
                </Typography>
              ) : (
                <Typography variant="h6">
                  {transactionsSelected.length === 1 && (
                    <div style={{marginBottom: 15}}>
                      You have selected that transaction{' '}
                      <strong>#{transactionsSelected[0]}</strong> should be
                      rerun.
                    </div>
                  )}
                  {(transactionsSelected.length > 1 || transactionsCount) && (
                    <div style={{marginBottom: 15}}>
                      You have selected a total of{' '}
                      <strong>
                        {bulkRerunActive
                          ? transactionsCount
                          : transactionsSelected.length}
                      </strong>{' '}
                      transactions to be rerun.
                    </div>
                  )}
                  {alerts.rerun.map((alert, index) => (
                    <Alert key={index} severity={'warning'}>
                      {alert.msg}
                    </Alert>
                  ))}
                  <div>
                    Are you sure you wish to proceed with this operation?
                  </div>
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="h6">
              {transactionsSelected.length === 1
                ? 'Your selected transaction has been added to the queue to be rerun.'
                : 'Your selected transactions have been added to the queue to be rerun.'}
            </Typography>
          )}
        </Box>
        {!rerunSuccess &&
          (transactionsSelected.length > 1 || transactionsCount > 0) && (
            <Box sx={{mb: 2, display: 'flex', alignItems: 'center'}}>
              <FormControl variant="outlined" sx={{mr: 2}}>
                <InputLabel>Batch size</InputLabel>
                <Select
                  value={taskSetup.batchSize}
                  //   onChange={handleBatchSizeChange}
                  label="Batch size"
                >
                  {batchSizes.map(batch => (
                    <MenuItem key={batch.value} value={batch.value}>
                      {batch.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={taskSetup.paused}
                    onChange={handlePausedChange}
                  />
                }
                label="Paused"
                sx={{ml: 2}}
              />
            </Box>
          )}
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button variant="outlined" onClick={handleClose} sx={{mr: 2}}>
            Close
          </Button>
          {transactionsSelected.length > 0 || transactionsCount > 0 ? (
            <Button variant="contained" color="primary" onClick={confirmRerun}>
              Confirm Batch Rerun
            </Button>
          ) : null}
        </Box>
      </Box>
    </Modal>
  )
}

export default RerunTransactionsConfirmationModal
