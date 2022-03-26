import React from 'react';
import {MtLoginBtn} from './MtLoginBtn';
import {MtLogoutBtn} from './MtLogoutBtn';

import { useAuth0 } from '@auth0/auth0-react';

export const MtAuthenticationBtn = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <MtLogoutBtn /> : <MtLoginBtn />;
};
