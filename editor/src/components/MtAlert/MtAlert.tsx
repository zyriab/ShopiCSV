import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Toast } from '@shopify/polaris';

export type MtAlertElement = {
  show: (params: ShowParams) => void;
};

interface ShowParams {
  message: string;
  isError?: boolean;
  duration?: number;
}

interface MtAlertProps {}

export const MtAlert = forwardRef<MtAlertElement, MtAlertProps>(
  (_props, ref) => {
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState(false);
    const [autoHideDuration, setAutoHideDuration] = useState(6000);

    function toggleDismiss() {
      setOpen((current) => !current);
    }

    function show({ message, isError = false, duration = 6000 }: ShowParams) {
      setMsg(message);
      setErr(isError);
      setAutoHideDuration(duration);
      setOpen(true);
    }

    useImperativeHandle(ref, () => ({
      show,
    }));

    return open ? (
      <Toast
        content={msg}
        error={err}
        onDismiss={toggleDismiss}
        duration={autoHideDuration}
      />
    ) : (
      <div style={{ display: 'none' }} />
    );
  }
);
