import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, IconButton, Menu, MenuItem, Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Channel {
  name: string;
  urlPattern: string;
  priority: number;
  access: string;
}

const channels: Channel[] = [
  { name: 'FHIR Server', urlPattern: '^/fhir.*$', priority: 1, access: 'instant' },
  { name: 'FHIR Server Direct', urlPattern: '^/fhir.*$', priority: 2, access: 'instant' },
  { name: '^/health$', urlPattern: 'FHIR Server - Amhara', priority: 2, access: 'instant' },
  { name: 'FHIR Server - Benishangul', urlPattern: '^/reprocess$', priority: 3, access: 'instant' },
  { name: 'FHIR Server - Dire Dawa', urlPattern: '^/reprocess$', priority: 4, access: 'instant' },
];

const ManageChannelsTable: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Channel Name</TableCell>
            <TableCell>URL Pattern</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Access</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {channels.map((channel, index) => (
            <TableRow key={index}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>{channel.name}</TableCell>
              <TableCell>{channel.urlPattern}</TableCell>
              <TableCell>{channel.priority}</TableCell>
              <TableCell>{channel.access}</TableCell>
              <TableCell align="right">
                <IconButton onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Edit Channel</MenuItem>
                  <MenuItem onClick={handleClose}>View Metrics</MenuItem>
                  <MenuItem onClick={handleClose}>View Logs</MenuItem>
                  <MenuItem onClick={handleClose}>Disable Channel</MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManageChannelsTable;