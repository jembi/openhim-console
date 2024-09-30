import {ChevronRight} from '@mui/icons-material'
import LockIcon from '@mui/icons-material/Lock'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Checkbox
} from '@mui/material'
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import React, {useState, useEffect} from 'react'
import {Transaction} from '../../types'
import StatusButton from '../buttons/status.button.component'
import SettingsDialog from '../dialogs/settings.dialog.component'
import convertTimestampFormat from '../helpers/timestampformat.helper.component'

const TransactionLogTable: React.FC<{
  transactions: Transaction[]
  loadMore: () => void
  loading: boolean
  initialTransactionLoadComplete: boolean
  onRowClick: (transaction: any) => void
  onSelectedChange(transactions: Transaction[]): void
}> = ({
  transactions,
  loadMore,
  onRowClick,
  loading,
  initialTransactionLoadComplete,
  onSelectedChange
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [openInNewTab, setOpenInNewTab] = useState(false)
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Transaction[]>([])

  useEffect(() => {
    onSelectedChange(selectedRows)
  }, [selectedRows])

  const handleSettingsApply = () => {
    setSettingsOpen(false)
  }

  const handleRowSelect = (selectedTransactionIds: Array<string>) => {
    const selectedTransactions = transactions.filter(t =>
      selectedTransactionIds.includes(t._id)
    )
    setSelectedRows(selectedTransactions)
  }

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.2,
      renderCell: params => (
        <IconButton
          sx={{
            height: '32px',
            width: '32px',
            backgroundColor: getStatusColor(params.row.status)
          }}
        >
          <LockIcon sx={{color: getStatusIconColor(params.row.status)}} />
        </IconButton>
      )
    },
    {
      field: 'request',
      headerName: 'Method',
      valueGetter: params => params.row.request.method
    },
    {
      field: 'host',
      resizable: true,
      flex: 1.5,
      headerName: 'Host',
      valueGetter: params => params.row.request.host
    },
    {
      field: 'port',
      headerName: 'Port',
      valueGetter: params => params.row.request.port
    },
    {
      field: 'path',
      headerName: 'Path',
      valueGetter: params => params.row.request.path
    },
    {
      field: 'params',
      headerName: 'Params',
      flex: 1,
      valueGetter: params => params.row.request.params
    },
    {
      field: 'channelName',
      flex: 1,
      headerName: 'Channel',
      valueGetter: params => params.row.channelName
    },
    {
      field: 'clientName',
      flex: 1,
      headerName: 'Client',
      valueGetter: params => params.row.clientName
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: params => (
        <StatusButton
          status={params.row.status}
          buttonText={params.row.status}
        />
      )
    },
    {
      field: 'timestamp',
      headerName: 'Time',
      flex: 2,
      valueGetter: params =>
        convertTimestampFormat(params.row.request.timestamp)
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
      case 'Pending Async':
        return 'rgba(33, 150, 243, 0.2)'
      case 'Successful':
        return 'rgba(76, 175, 80, 0.2)'
      case 'Completed':
      case 'Completed with error(s)':
        return 'rgba(255, 193, 7, 0.2)'
      default:
        return 'rgba(244, 67, 54, 0.2)'
    }
  }

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case 'Processing':
      case 'Pending Async':
        return 'info.main'
      case 'Successful':
        return 'success.main'
      case 'Completed':
      case 'Completed with error(s)':
        return 'warning.main'
      default:
        return 'error.main'
    }
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
        <DataGrid
          rows={transactions}
          getRowId={t => t._id}
          columns={columns}
          checkboxSelection
          rowSelection
          onRowSelectionModelChange={handleRowSelect}
          loading={!initialTransactionLoadComplete}
          autoHeight
          // rowsPerPageOptions={[10, 20, 50]}
          components={{
            NoRowsOverlay: () =>
              loading ? (
                <CircularProgress size={24} />
              ) : (
                <Box sx={{ textAlign: 'center', padding: 2, }}>
                  <Typography>There are no transactions for the current filters.</Typography>
                </Box>
              )
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={loadMore}
            endIcon={<ChevronRight />}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Load 20 more results'}
          </Button>
        </Box>
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