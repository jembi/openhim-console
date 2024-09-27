import React, {useCallback, useEffect} from 'react'
import {Box, TextField, MenuItem, Grid, Button, Card} from '@mui/material'
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {BasicFilterProps} from '../../interfaces/index.interface'
import {debounce} from 'lodash'

const BasicFilters: React.FC<BasicFilterProps> = ({
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
  channels,
  fetchTransactionLogs
}) => {

  const debounceFetchTransactionLogs = useCallback(
    debounce(() => fetchTransactionLogs(null, true), 500),
    [fetchTransactionLogs]
  );

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

  useEffect(() => {
    (async () => {
      await debounceFetchTransactionLogs()
    })()
    
    return () => debounceFetchTransactionLogs.cancel()
  }, [status, searchQuery, channel, limit, startDate, endDate, reruns])

  const handleClearFilters = () => {
    setStatus('NoFilter')
    setSearchQuery('')
    setChannel('NoFilter')
    setStartDate(null)
    setEndDate(null)
    setLimit(10)
    setReruns('NoFilter')
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
            <MenuItem value="Successful">Successful</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            InputLabelProps={{shrink: true}}
          />
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
            <MenuItem key={10} value={10}>
              10
            </MenuItem>
            <MenuItem key={20} value={20}>
              20
            </MenuItem>
            <MenuItem key={50} value={50}>
              50
            </MenuItem>
            <MenuItem key={100} value={100}>
              100
            </MenuItem>
            <MenuItem key={200} value={200}>
              200
            </MenuItem>
            <MenuItem key={500} value={500}>
              500
            </MenuItem>
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
      </Grid>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        sx={{marginTop: 2}}
      >
        <Grid item>
          <Button variant="outlined" color="primary" sx={{marginRight: 2}}>
            RERUN MATCHES
          </Button>
          <Button variant="text" color="primary" sx={{marginRight: 2}}>
            RERUN SELECTED
          </Button>
        </Grid>
        <Grid item>
          <Button variant="text" color="primary" onClick={handleClearFilters}>
            CLEAR
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BasicFilters
