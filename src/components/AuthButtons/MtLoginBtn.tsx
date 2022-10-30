import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@shopify/polaris';

export function MtLoginBtn() {
  const { t } = useTranslation();
  const { loginWithRedirect } = useAuth0();
  return (
    <Button primary fullWidth onClick={() => loginWithRedirect()}>
      {t('General.login')}
    </Button>
  );
}
