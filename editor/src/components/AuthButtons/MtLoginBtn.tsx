import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';

export const MtLoginBtn = () => {
  const { loginWithPopup } = useAuth0();
  return (
    <Button
      onClick={() => loginWithPopup()}>
      Log In
    </Button>
  );
};
