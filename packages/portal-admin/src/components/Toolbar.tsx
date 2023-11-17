import React from 'react';
import { Button, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ToolbarProps {
  handleRefresh: () => void;
}
export function Toolbar({ handleRefresh }: ToolbarProps) {
  return (
    <section id="apps-toolbar">
      <Stack direction="row" spacing={2} p={2}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleRefresh}
        >
          <RefreshIcon /> Refresh
        </Button>
        <Button disabled variant="contained" color="primary" size="medium">
          Add
        </Button>
        <Button disabled variant="contained" color="primary" size="medium">
          Edit
        </Button>
        <Button disabled variant="contained" color="primary" size="medium">
          Delete
        </Button>
      </Stack>
    </section>
  );
}
