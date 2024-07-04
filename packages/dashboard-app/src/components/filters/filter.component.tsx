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

const AdvancedFilters: React.FC = () => {
  const clients = ['Client A', 'Client B', 'Client C'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];

  return (
    <Box p={3} border={1} borderColor="grey.300">
      <Typography variant="h6">Advanced Filters:</Typography>
      <Grid container spacing={2} mt={2}>
        {/* Filter by Transaction */}
        <Grid item xs={4}>
          <Box border={1} borderColor="grey.300" p={2}>
            <Typography variant="subtitle1">Filter by Transaction:</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Tooltip title="Enter Status Code" arrow>
                  <TextField
                    label="Status Code"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <HelpOutlineIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <TextField label="Host" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Port" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Path" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Request Param Key" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Request Param Value" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Client"
                  fullWidth
                  defaultValue="Don't filter"
                >
                  <MenuItem value="Don't filter">Don't filter</MenuItem>
                  {clients.map((client, index) => (
                    <MenuItem key={index} value={client}>
                      {client}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Method"
                  fullWidth
                  defaultValue="Don't filter"
                >
                  <MenuItem value="Don't filter">Don't filter</MenuItem>
                  {methods.map((method, index) => (
                    <MenuItem key={index} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField label="Property Key" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Property Value" fullWidth />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Filter by Route */}
        <Grid item xs={4}>
          <Box border={1} borderColor="grey.300" p={2}>
            <Typography variant="subtitle1">Filter by Route:</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Tooltip title="Enter Status Code" arrow>
                  <TextField
                    label="Status Code"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <HelpOutlineIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <TextField label="Host" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Port" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Path" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Request Param Key" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Request Param Value" fullWidth />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Filter by Orchestration */}
        <Grid item xs={4}>
          <Box border={1} borderColor="grey.300" p={2}>
            <Typography variant="subtitle1">Filter by Orchestration:</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Tooltip title="Enter Status Code" arrow>
                  <TextField
                    label="Status Code"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <HelpOutlineIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <TextField label="Host" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Port" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Path" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Request Param Key" fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Request Param Value" fullWidth />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedFilters;
