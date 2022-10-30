import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@shopify/polaris';

export function MtLogoutBtn() {
  const { t } = useTranslation();
  const { logout } = useAuth0();
  return (
    <Button
      destructive
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }>
      {t('General.logout')}
    </Button>
  );
}
