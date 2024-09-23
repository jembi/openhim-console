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
  TableFooter,
  CircularProgress,
  Slide
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsDialog from '../dialogs/settings.dialog.component'
import {ChevronRight} from '@mui/icons-material'
import LockIcon from '@mui/icons-material/Lock'
import convertTimestampFormat from '../helpers/timestampformat.helper.component'
import StatusButton from '../buttons/status.button.component'
import {AnimatedTableRow} from './animated.table.row.component'

const TransactionLogTable: React.FC<{
  transactions: any[]
  loadMore: () => void
  loading: boolean
  initialTransactionLoadComplete: boolean
  onRowClick: (transaction: any) => void
}> = ({
  transactions,
  loadMore,
  onRowClick,
  loading,
  initialTransactionLoadComplete
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [openInNewTab, setOpenInNewTab] = useState(false)
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const handleSettingsApply = () => {
    setSettingsOpen(false)
  }

  const handleRowClick = (event: React.MouseEvent, transaction: {_id: any}) => {
    const nonClickableColumnClass = 'non-clickable-column'
    if ((event.target as HTMLElement).closest(`.${nonClickableColumnClass}`)) {
      return
    }
    const transactionDetailsUrl = `/#!/transactions/${transaction._id}`

    if (openInNewTab) {
      window.open(transactionDetailsUrl, '_blank')
    } else {
      window.location.href = transactionDetailsUrl
    }
  }

  const handleRowSelect = (rowIndex: number) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows)
      if (newSelectedRows.has(rowIndex)) {
        newSelectedRows.delete(rowIndex)
      } else {
        newSelectedRows.add(rowIndex)
      }
      return newSelectedRows
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set())
    } else {
      const allRowIndexes = transactions.map((_, index) => index)
      setSelectedRows(new Set(allRowIndexes))
    }
    setSelectAll(!selectAll)
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
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
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
              {initialTransactionLoadComplete ? (
                transactions.map((transaction, index) => (
                  <AnimatedTableRow
                    key={transaction['_id']}
                    initialColor="grey"
                    finalColor="white"
                    onClick={event => handleRowClick(event, transaction)}
                  >
                    <TableCell
                      padding="checkbox"
                      className="non-clickable-column"
                    >
                      <Checkbox
                        checked={selectedRows.has(index)}
                        onChange={() => handleRowSelect(index)}
                      />
                    </TableCell>
                    <TableCell>
                        <IconButton
                          sx={{
                            height: '32px',
                            width: '32px',
                            backgroundColor:
                              transaction.status === 'Processing'
                                ? 'rgba(33, 150, 243, 0.2)' // info.light with 20% opacity
                                : transaction.status === 'Pending Async'
                                ? 'rgba(33, 150, 243, 0.2)' // info.light with 20% opacity
                                : transaction.status === 'Successful'
                                ? 'rgba(76, 175, 80, 0.2)' // success.light with 20% opacity
                                : transaction.status === 'Completed'
                                ? 'rgba(255, 193, 7, 0.2)' // warning.light with 20% opacity
                                : transaction.status === 'Completed with error(s)'
                                ? 'rgba(255, 193, 7, 0.2)' // warning.light with 20% opacity
                                : 'rgba(244, 67, 54, 0.2)', // error.light with 20% opacity
                            borderRadius: 0,
                            '&:hover': {
                              backgroundColor:
                                transaction.status === 'Processing'
                                  ? 'rgba(33, 150, 243, 0.2)' // info.light with 20% opacity
                                  : transaction.status === 'Pending Async'
                                  ? 'rgba(33, 150, 243, 0.2)' // info.light with 20% opacity
                                  : transaction.status === 'Successful'
                                  ? 'rgba(76, 175, 80, 0.2)' // success.light with 20% opacity
                                  : transaction.status === 'Completed'
                                  ? 'rgba(255, 193, 7, 0.2)' // warning.light with 20% opacity
                                  : transaction.status === 'Completed with error(s)'
                                  ? 'rgba(255, 193, 7, 0.2)' // warning.light with 20% opacity
                                  : 'rgba(244, 67, 54, 0.2)', // error.light with 20% opacity
                            },
                          }}
                        >
                          <LockIcon
                            sx={{
                              color:
                                transaction.status === 'Processing'
                                  ? 'info.main'
                                  : transaction.status === 'Pending Async'
                                  ? 'info.main'
                                  : transaction.status === 'Successful'
                                  ? 'success.main'
                                  : transaction.status === 'Completed'
                                  ? 'warning.main'
                                  : transaction.status === 'Completed with error(s)'
                                  ? 'warning.main'
                                  : 'error.main',
                            }}
                          />
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
                      <StatusButton
                        status={transaction.status}
                        buttonText={transaction.status}
                      />
                    </TableCell>
                    <TableCell>
                      {convertTimestampFormat(transaction.request.timestamp)}
                    </TableCell>
                  </AnimatedTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}
              {initialTransactionLoadComplete && transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    There are no transactions for the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={11} align="right">
                  <Button
                    onClick={loadMore}
                    endIcon={<ChevronRight />}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Load 20 more results'
                    )}
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
