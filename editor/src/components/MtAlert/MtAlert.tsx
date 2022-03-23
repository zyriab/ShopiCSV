import React, { forwardRef, useState, useImperativeHandle } from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type MtAlertElement = {
  show: (message: string, type?: AlertColor, duration?: number) => void;
};

interface AppProps {}

export const MtAlert = forwardRef<MtAlertElement, AppProps>((props, ref) => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState<AlertColor | undefined>();
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  function handleClose(
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  function show(
    message: string,
    type: AlertColor = 'success',
    duration = 6000
  ) {
    setMsg(message);
    setSeverity(type);
    setAutoHideDuration(duration);
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({
    show,
  }));

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {msg}
      </Alert>
    </Snackbar>
  );
});
