import React from 'react';
import { Box, TextField, MenuItem, Button, Grid } from '@mui/material';

interface FilterProps {
  limit: number;
  setLimit: (value: number) => void;
}

const CustomFilters: React.FC<FilterProps> = ({ limit, setLimit }) => {
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(event.target.value));
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <TextField select label="Status" defaultValue="Failed" fullWidth>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Success">Success</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={2}>
          <TextField select label="Channel" fullWidth defaultValue="Channel1">
            <MenuItem value="Channel1">Channel1</MenuItem>
            <MenuItem value="Channel2">Channel2</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField label="Date Range" type="date" fullWidth InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={1}>
          <TextField label="Limit" type="number" value={limit} onChange={handleLimitChange} fullWidth />
        </Grid>
        <Grid item xs={2}>
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
        <Grid item xs={2}>
          <Button variant="outlined" color="primary" fullWidth>
            CLEAR
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: '16px', textAlign: 'right' }}>
        <Button variant="outlined" color="primary">
          CUSTOMISE
        </Button>
      </Box>
    </Box>
  );
};

export default CustomFilters;
