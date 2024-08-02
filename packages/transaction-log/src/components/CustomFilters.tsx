import React from 'react'
import {Box, TextField, MenuItem, Button, Grid} from '@mui/material'
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

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

  return (
    <Box sx={{padding: '16px'}}>
      <Grid container spacing={2}>
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
        <Grid item xs={2}>
          <Button variant="outlined" color="primary" fullWidth>
            CLEAR
          </Button>
        </Grid>
      </Grid>
      <Box sx={{marginTop: '16px', textAlign: 'right'}}>
        <Button variant="outlined" color="primary">
          CUSTOMISE
        </Button>
      </Box>
    </Box>
  )
}

export default CustomFilters
