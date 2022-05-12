import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@shopify/polaris';

export const MtLoginBtn = () => {
  const { loginWithPopup } = useAuth0();
  return (
    <Button primary onClick={() => loginWithPopup()}>
      Log In
    </Button>
  );
};
