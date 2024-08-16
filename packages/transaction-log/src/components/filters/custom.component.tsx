import React, {useState} from 'react'
import {Box, TextField, MenuItem, Button, Grid} from '@mui/material'
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import CustomizeDialog from '../dialogs/customize.dialog.component'
import {CustomFilterProps} from '../../interfaces/index.interface'

const CustomFilters: React.FC<CustomFilterProps> = ({
  status,
  setStatus,
  statusCode,
  setStatusCode,
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
  host,
  setHost,
  port,
  setPort,
  path,
  setPath,
  param,
  setParam,
  client,
  setClient,
  clients,
  method,
  setMethod
}) => {
  const [open, setOpen] = useState(false)

  const [visibleFilters, setVisibleFilters] = useState({
    status: true,
    statusCode: true,
    searchQuery: true,
    channel: true,
    startDate: true,
    endDate: true,
    limit: true,
    reruns: true,
    host: false,
    port: false,
    path: false,
    param: false,
    client: false,
    method: false
  })

  const [tempVisibleFilters, setTempVisibleFilters] = useState(visibleFilters)

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value)
  }

  const handleStatusCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStatusCode(Number(event.target.value) || null)
  }

  const handleChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannel(event.target.value)
  }

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value) || 10)
  }

  const handleRerunsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReruns(event.target.value)
  }

  const handleHostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHost(event.target.value)
  }

  const handlePortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(Number(event.target.value) || null)
  }

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPath(event.target.value)
  }

  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParam(event.target.value)
  }

  const handleClientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClient(event.target.value)
  }

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMethod(event.target.value)
  }

  const handleClearFilters = () => {
    setStatus('NoFilter')
    setStatusCode(null)
    setChannel('NoFilter')
    setStartDate(null)
    setEndDate(null)
    setLimit(10)
    setReruns('NoFilter')
    setHost('')
    setPort(null)
    setPath('')
    setParam('')
    setClient('NoFilter')
    setMethod('NoFilter')
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
        {visibleFilters.statusCode && (
          <Grid item xs={1}>
            <TextField
              label="Status Code"
              type="number"
              value={statusCode ?? ''}
              onChange={handleStatusCodeChange}
              fullWidth
              InputLabelProps={{shrink: true}}
            />
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
        {visibleFilters.host && (
          <Grid item xs={1}>
            <TextField
              label="Host"
              type="text"
              value={host}
              onChange={handleHostChange}
              InputLabelProps={{shrink: true}}
              fullWidth
            />
          </Grid>
        )}
        {visibleFilters.port && (
          <Grid item xs={1} sm={1} md={1}>
            <TextField
              label="Port"
              type="number"
              value={port ?? ''}
              onChange={handlePortChange}
              InputLabelProps={{shrink: true}}
              fullWidth
            />
          </Grid>
        )}
        {visibleFilters.path && (
          <Grid item xs={2} sm={2} md={2}>
            <TextField
              label="Path"
              type="string"
              value={path}
              onChange={handlePathChange}
              InputLabelProps={{shrink: true}}
              fullWidth
            />
          </Grid>
        )}
        {visibleFilters.param && (
          <Grid item xs={2} sm={2} md={2}>
            <TextField
              label="Request Param Key"
              type="text"
              value={param}
              onChange={handleParamChange}
              InputLabelProps={{shrink: true}}
              fullWidth
            />
          </Grid>
        )}
        {visibleFilters.client && (
          <Grid item xs={2} sm={2} md={2}>
            <TextField
              select
              label="Client"
              value={client}
              onChange={handleClientChange}
              InputLabelProps={{shrink: true}}
              fullWidth
            >
              <MenuItem value="NoFilter">Don't Filter</MenuItem>
              {clients.map(client => (
                <MenuItem key={client._id} value={client._id}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        {visibleFilters.method && (
          <Grid item xs={2} sm={2} md={2}>
            <TextField
              select
              label="Method"
              value={method}
              onChange={handleMethodChange}
              fullWidth
            >
              <MenuItem value="NoFilter">Don't Filter</MenuItem>
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
            </TextField>
          </Grid>
        )}
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
          <Button
            variant="outlined"
            color="primary"
            onClick={handleToggleDialog}
          >
            CUSTOMISE
          </Button>
        </Grid>
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
