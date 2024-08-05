import React, {useState} from 'react'
import {Box, TextField, MenuItem, Button, Grid} from '@mui/material'
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import CustomizeDialog from './CustomizeDialog'

interface FilterProps {
  status: string
  setStatus: (value: string) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  channel: string
  setChannel: (value: string) => void
  startDate: Date | null
  setStartDate: (value: Date | null) => void
  endDate: Date | null
  setEndDate: (value: Date | null) => void
  limit: number
  setLimit: (value: number) => void
  reruns: string
  setReruns: (value: string) => void
  channels: any[]
}

const CustomFilters: React.FC<FilterProps> = ({
  status,
  setStatus,
  searchQuery,
  setSearchQuery,
  channel,
  setChannel,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  limit,
  setLimit,
  reruns,
  setReruns,
  channels
}) => {
  const [open, setOpen] = useState(false)

  const [visibleFilters, setVisibleFilters] = useState({
    status: true,
    searchQuery: true,
    channel: true,
    startDate: true,
    endDate: true,
    limit: true,
    reruns: true
  })

  const [tempVisibleFilters, setTempVisibleFilters] = useState(visibleFilters)

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannel(event.target.value)
  }

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value))
  }

  const handleRerunsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReruns(event.target.value)
  }

  const handleClearFilters = () => {
    setStatus('NoFilter')
    setSearchQuery('')
    setChannel('NoFilter')
    setStartDate(null)
    setEndDate(null)
    setLimit(10)
    setReruns('NoFilter')
  }

  const handleToggleDialog = () => {
    setTempVisibleFilters(visibleFilters)
    setOpen(!open)
  }

  const handleFilterVisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {name, checked} = event.target
    setTempVisibleFilters(prevFilters => ({
      ...prevFilters,
      [name]: checked
    }))
  }

  const handleApplyFilters = () => {
    setVisibleFilters(tempVisibleFilters)
    setOpen(false)
  }

  return (
    <Box sx={{padding: '16px'}}>
      <Grid container spacing={2}>
        {visibleFilters.status && (
          <Grid item xs={2}>
            <TextField
              select
              label="Status"
              value={status}
              onChange={handleStatusChange}
              fullWidth
            >
              <MenuItem value="NoFilter">Don't Filter</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Completed with error(s)">
                Completed with error(s)
              </MenuItem>
              <MenuItem value="Success">Success</MenuItem>
            </TextField>
          </Grid>
        )}
        {visibleFilters.channel && (
          <Grid item xs={2}>
            <TextField
              select
              label="Channel"
              value={channel}
              onChange={handleChannelChange}
              fullWidth
              InputLabelProps={{shrink: true}}
            >
              <MenuItem value="NoFilter">Don't Filter</MenuItem>
              {channels.map(channel => (
                <MenuItem key={channel._id} value={channel._id}>
                  {channel.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        {visibleFilters.startDate && (
          <Grid item xs={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={newValue => {
                  setStartDate(newValue)
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
        {visibleFilters.endDate && (
          <Grid item xs={1}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End Date"
                value={endDate}
                onChange={newValue => {
                  setEndDate(newValue)
                }}
              />
            </LocalizationProvider>
          </Grid>
        )}
        {visibleFilters.limit && (
          <Grid item xs={1}>
            <TextField
              select
              label="Limit"
              value={limit}
              onChange={handleLimitChange}
              fullWidth
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={200}>200</MenuItem>
              <MenuItem value={500}>500</MenuItem>
            </TextField>
          </Grid>
        )}
        {visibleFilters.reruns && (
          <Grid item xs={2}>
            <TextField
              select
              label="Reruns"
              value={reruns}
              onChange={handleRerunsChange}
              fullWidth
            >
              <MenuItem value="NoFilter">Don't Filter</MenuItem>
              <MenuItem value="Yes">Include reruns</MenuItem>
              <MenuItem value="No">Don't Include reruns</MenuItem>
            </TextField>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} sm={12} sx={{textAlign: 'right', marginTop: 2}}>
        <Button variant="outlined" color="primary" sx={{marginRight: 2}}>
          RERUN MATCHES
        </Button>
        <Button variant="outlined" color="primary" sx={{marginRight: 2}}>
          RERUN SELECTED
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearFilters}
        >
          CLEAR
        </Button>
        <Button variant="outlined" color="primary" onClick={handleToggleDialog}>
          CUSTOMISE
        </Button>
      </Grid>
      <CustomizeDialog
        open={open}
        onClose={handleToggleDialog}
        onApply={handleApplyFilters}
        visibleFilters={tempVisibleFilters}
        handleFilterVisibilityChange={handleFilterVisibilityChange}
      />
    </Box>
  )
}

export default CustomFilters
