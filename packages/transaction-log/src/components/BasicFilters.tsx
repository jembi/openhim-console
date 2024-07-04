import React from 'react'
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid
} from '@mui/material'

const BasicFilters: React.FC = () => {
  return (
    <Box sx={{padding: '16px'}}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField select label="Status" defaultValue="Failed" fullWidth>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Success">Success</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField label="Search" type="date" fullWidth InputLabelProps={{shrink: true}} />
        </Grid>
        <Grid item xs={2}>
          <TextField select label="Channel" fullWidth defaultValue="Channel1" InputLabelProps={{shrink: true}}>
            <MenuItem value="Channel1">Channel1</MenuItem>
            <MenuItem value="Channel2">Channel2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField label="Date Range" type="date" fullWidth InputLabelProps={{shrink: true}} />
        </Grid>
        <Grid item xs={1}>
          <TextField label="Limit" type="number" defaultValue={20} fullWidth />
        </Grid>
        <Grid item xs={1}>
          <TextField
            select
            label="Reruns"
            defaultValue="Include reruns"
            fullWidth
          >
            <MenuItem value="Include reruns">Include reruns</MenuItem>
            <MenuItem value="Exclude reruns">Exclude reruns</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BasicFilters
