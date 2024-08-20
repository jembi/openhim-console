import React, {useState} from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Button,
  IconButton,
  TableFooter
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsDialog from '../dialogs/settings.dialog.component'
import {ChevronRight} from '@mui/icons-material'
import LockIcon from '@mui/icons-material/Lock'

const TransactionLogTable: React.FC<{
  transactions: any[]
  loadMore: () => void
  onRowClick: (transaction) => void
}> = ({transactions, loadMore, onRowClick}) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [openInNewTab, setOpenInNewTab] = useState(false)
  const [autoUpdate, setAutoUpdate] = useState(false)

  const handleSettingsApply = () => {
    setSettingsOpen(false)
  }

  const handleRowClick = transaction => {
    const transactionDetailsUrl = `/#!/transactions/${transaction._id}`
    window.location.href = transactionDetailsUrl
  }

  function StatusButton(status, buttonText) {
    const buttonColor =
      status === 'Processing'
        ? 'info'
        : status === 'Pending Async'
        ? 'info'
        : status === 'Successful'
        ? 'success'
        : status === 'Completed'
        ? 'warning'
        : status === 'Completed with error(s)'
        ? 'warning'
        : 'error'

    return (
      <Button variant="contained" color={buttonColor}>
        {buttonText}
      </Button>
    )
  }

  return (
    <Box sx={{padding: '16px'}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2
        }}
      >
        <IconButton onClick={() => setSettingsOpen(true)} color="primary">
          <SettingsIcon />
          <Typography
            variant="body1"
            sx={{marginRight: '8px', marginLeft: '3px'}}
          >
            SETTINGS
          </Typography>
        </IconButton>
      </Box>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Host</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Path</TableCell>
                <TableCell>Params</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  hover
                  style={{cursor: 'pointer'}}
                  onClick={() => handleRowClick(transaction)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{
                        height: '32px',
                        width: '32px',
                        backgroundColor: '#FECDD2',
                        borderRadius: 0
                      }}
                    >
                      <LockIcon style={{color: '#C62828'}} />
                    </IconButton>
                  </TableCell>
                  <TableCell>{transaction.request.method}</TableCell>
                  <TableCell>{transaction.request.host}</TableCell>
                  <TableCell>{transaction.request.port}</TableCell>
                  <TableCell>{transaction.request.path}</TableCell>
                  <TableCell>{transaction.request.params}</TableCell>
                  <TableCell>{transaction.channelName}</TableCell>
                  <TableCell>{transaction.clientName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={
                        transaction.status === 'Processing'
                          ? 'info'
                          : transaction.status === 'Pending Async'
                          ? 'info'
                          : transaction.status === 'Successful'
                          ? 'success'
                          : transaction.status === 'Completed'
                          ? 'warning'
                          : transaction.status === 'Completed with error(s)'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {transaction.status}
                    </Button>
                  </TableCell>
                  <TableCell>{transaction.request.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10} align="right">
                  <Button onClick={loadMore} endIcon={<ChevronRight />}>
                    Load 20 more results
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onApply={handleSettingsApply}
        openInNewTab={openInNewTab}
        setOpenInNewTab={setOpenInNewTab}
        autoUpdate={autoUpdate}
        setAutoUpdate={setAutoUpdate}
      />
    </Box>
  )
}

export default TransactionLogTable
