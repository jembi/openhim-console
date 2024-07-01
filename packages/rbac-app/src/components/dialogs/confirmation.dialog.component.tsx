import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { DialogProps } from '@mui/material';

export type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onYes: () => unknown;
  onNo: () => unknown;
  size?: DialogProps['maxWidth'];
}

export function ConfirmationDialog(props: ConfirmationDialogProps) {

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth={props.size ?? 'sm'}
      open={props.open}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onNo}>
          Cancel
        </Button>
        <Button onClick={props.onYes}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

