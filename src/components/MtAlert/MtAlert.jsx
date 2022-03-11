import { forwardRef, useState, useImperativeHandle } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const MtAlert = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('');
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  function show(message, type = 'success', duration = 6000) {
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
