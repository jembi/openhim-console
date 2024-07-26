import React from 'react'
import {Box, TextField, MenuItem, Grid} from '@mui/material'

interface FilterProps {
  limit: number
  setLimit: (value: number) => void
  status: string
  setStatus: (value: string) => void
  channels: any[]
  setChannel: (value: string) => void
  channel: string
}

const BasicFilters: React.FC<FilterProps> = ({
  limit,
  setLimit,
  status,
  setStatus,
  channels,
  setChannel,
  channel
}) => {
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value))
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.value)
  }

  const handleChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannel(event.target.value)
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
        <Grid item xs={3}>
          <TextField
            label="Search"
            type="text"
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
        <Grid item xs={3}>
          <TextField
            label="Date Range"
            type="date"
            fullWidth
            InputLabelProps={{shrink: true}}
          />
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
        <Grid item xs={1}>
          <TextField
            select
            label="Reruns"
            defaultValue="Include reruns"
            fullWidth
          >
            <MenuItem value="NoFilter">Don't Filter</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BasicFilters
