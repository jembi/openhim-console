import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export type BasicFilterObj = {
  startDate: string;
  endDate: string;
  limit: number;
  rerun: string;
  channel: string;
  status: string;
}

export type BasicFilterProps = {
  onFilterChange: (filter: BasicFilterObj) => unknown;
}

function BasicFilter(props: BasicFilterProps) {
  const statuses = ['Don\'t filter', 'Status 1', 'Status 2'];
  const channels = ['Don\'t filter', 'Channel 1', 'Channel 2'];
  const reruns = ['Don\'t filter', 'Yes', 'No'];
  const limits = [10, 20, 50, 100, 200, 500];

  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [limit, setLimit] = React.useState(limits[2]);
  const [rerun, setRerun] = React.useState(reruns[0]);
  const [channel, setChannel] = React.useState(channels[0]);
  const [status, setStatus] = React.useState(statuses[0]);

  const emitFilterChange = () => {
    const filter: BasicFilterObj = {
      startDate,
      endDate,
      limit,
      rerun,
      channel,
      status,
    };
    props.onFilterChange(filter);
  };

  return (
    <Box p={3} border={1} borderColor="grey.300">
      <Typography variant="h6">Basic Filters</Typography>
      <Grid container spacing={2} mt={2}>
        {/* Status Filter */}
        <Grid item xs={3}>
          <Tooltip title="Filter by Status" arrow>
            <TextField
              select
              label="Status"
              fullWidth
              value={status}
              onChange={e => setStatus(e.target.value)}
              defaultValue={statuses[0]}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                ),
              }}
            >
              {statuses.map((status, index) => (
                <MenuItem key={index} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>

        {/* Channel Filter */}
        <Grid item xs={3}>
          <Tooltip title="Filter by Channel" arrow>
            <TextField
              select
              label="Channel"
              value={channel}
              onChange={e => setChannel(e.target.value)}
              fullWidth
              defaultValue={channels[0]}
            >
              {channels.map((channel, index) => (
                <MenuItem key={index} value={channel}>
                  {channel}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>

        {/* Date Range Filter */}
        <Grid item xs={3}>
          <Tooltip title="Filter by Date Range" arrow>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Tooltip>
        </Grid>

        {/* Limit Filter */}
        <Grid item xs={1}>
          <Tooltip title="Set Result Limit" arrow>
            <TextField
              select
              label="Limit"
              value={limit}
              onChange={e => setLimit(+e.target.value)}
              fullWidth
              defaultValue={limits[1]}
            >
              {limits.map((limit, index) => (
                <MenuItem key={index} value={limit}>
                  {limit}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>

        {/* Show Reruns Filter */}
        <Grid item xs={2}>
          <Tooltip title="Show Reruns" arrow>
            <TextField
              select
              label="Show Reruns"
              value={rerun}
              onChange={e => setRerun(e.target.value)}
              fullWidth
              defaultValue="Don't filter"
            >
              {reruns.map((rerun, index) => (
                <MenuItem key={index} value={rerun}>
                  {rerun}
                </MenuItem>
              ))}
            </TextField>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}

export default BasicFilter;
