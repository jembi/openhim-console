import React, {useEffect, useState} from 'react'
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
import {BorderBottom, ChevronRight} from '@mui/icons-material'
import LockIcon from '@mui/icons-material/Lock'
import convertTimestampFormat from '../helpers/timestampformat.helper.component'
import StatusButton from '../buttons/status.button.component'
import {AnimatedTableRow} from './animated.table.row.component'
import {Transaction} from '../../types'
import {tr} from 'date-fns/locale'
import {TransactionLogTableProps} from '../../interfaces/index.interface'

const TransactionLogTable: React.FC<TransactionLogTableProps> = ({
  transactions,
  loadMore,
  onRowClick,
  loading,
  initialTransactionLoadComplete,
  onSelectedChange,
  onAutoUpdateChange
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [openInNewTab, setOpenInNewTab] = useState(false)
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [selectedRows, setSelectedRows] = useState<Set<Transaction>>(
    new Set([])
  )
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    onSelectedChange(Array.from(selectedRows))
  }, [selectedRows])

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

  const handleRowSelect = (transaction: Transaction) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows)
      if (newSelectedRows.has(transaction)) {
        newSelectedRows.delete(transaction)
      } else {
        newSelectedRows.add(transaction)
      }
      return newSelectedRows
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set([]))
    } else {
      setSelectedRows(new Set(transactions))
    }
    setSelectAll(!selectAll)
  }

  useEffect(() => {
    onAutoUpdateChange(autoUpdate)
  }, [autoUpdate, onAutoUpdateChange])

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2
        }}
      >
        <Button onClick={() => setSettingsOpen(true)} color="primary">
          <SettingsIcon />
          <Typography
            variant="body1"
            sx={{marginRight: '8px', marginLeft: '3px'}}
          >
            SETTINGS
          </Typography>
        </Button>
      </Box>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{borderBottom: 'none', backgroundColor: '#F8F8F8'}}>
                <TableCell
                  padding="checkbox"
                  sx={{
                    borderBottom: 'none',
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Type
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Status
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Method
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Host
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Port
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Path
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Params
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Channel
                </TableCell>
                <TableCell sx={{borderBottom: 'none', fontWeight: 'bold'}}>
                  Client
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: 'none',
                    borderTopRightRadius: '12px',
                    borderBottomRightRadius: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initialTransactionLoadComplete ? (
                transactions.map((transaction, index) => (
                  <TableRow
                    key={transaction['_id']}
                    onClick={event => handleRowClick(event, transaction)}
                    sx={{
                      borderBottom: 'none',
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                    }}
                  >
                    <TableCell
                      padding="checkbox"
                      className="non-clickable-column"
                      sx={{borderBottom: 'none'}}
                    >
                      <Checkbox
                        checked={selectedRows.has(transaction)}
                        onChange={() => handleRowSelect(transaction)}
                      />
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
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
                                : transaction.status ===
                                  'Completed with error(s)'
                                ? 'rgba(255, 193, 7, 0.2)' // warning.light with 20% opacity
                                : 'rgba(244, 67, 54, 0.2)' // error.light with 20% opacity
                          }
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
                                : transaction.status ===
                                  'Completed with error(s)'
                                ? 'warning.main'
                                : 'error.main'
                          }}
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell
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
                        borderBottom: 'none'
                      }}
                    >
                      {transaction.status}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {transaction.request.method}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {transaction.request.host}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {transaction.request.port}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {transaction.request.path}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {(transaction.request as any).params}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {(transaction as any).channelName}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {(transaction as any).clientName}
                    </TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>
                      {convertTimestampFormat(
                        transaction.request.timestamp as any
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}
              {initialTransactionLoadComplete && transactions.length === 0 && (
                <TableRow sx={{borderBottom: 'none'}}>
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{borderBottom: 'none'}}
                  >
                    There are no transactions for the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow sx={{borderBottom: 'none'}}>
                <TableCell
                  colSpan={11}
                  align="right"
                  sx={{borderBottom: 'none'}}
                >
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
