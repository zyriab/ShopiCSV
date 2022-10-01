import React, { useState } from 'react';
import { useAuth0 } from '../../utils/hooks/useAuth0';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';
import MtDarkModeSwitch from '../MtDarkModeSwitch/MtDarkModeSwitch';
import { MtAuthenticationBtn } from '../AuthButtons/MtAuthenticationBtn';
import { MtLanguageSelector } from '../MtLanguageSelector/MtLanguageSelector';
import { CustomProperties, Stack, TopBar } from '@shopify/polaris';
import { LogOutMinor } from '@shopify/polaris-icons';
import { useTranslation } from 'react-i18next';
import MtNavMenu from '../MtNavMenu/MtNavMenu';

export default function MtNavBar() {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth0();
  const { isMobile } = useDetectScreenSize();

  const userMenuEl = isAuthenticated ? (
    <div className="ml-05">
      <TopBar.UserMenu
        actions={[
          {
            items: [
              {
                content: t('General.logout'),
                icon: LogOutMinor,
                onAction: () => console.log('Cannot logout on demo ;)'),
              },
            ],
          },
        ]}
        name={user?.nickname || 'Not connected'}
        detail={user?.email}
        initials={user?.nickname?.at(0)?.toUpperCase() || '?'}
        avatar={user?.picture}
        open={isUserMenuOpen}
        onToggle={() => setIsUserMenuOpen((current) => !current)}
      />
    </div>
  ) : (
    <div className="Auth-Btn__Top-Bar">
      <MtAuthenticationBtn />
    </div>
  );

  const secondaryMenuEl = (
    <Stack wrap={false} alignment="center">
      {!isMobile && <MtDarkModeSwitch />}
      <MtLanguageSelector />
    </Stack>
  );

  return (
    <div id="Top-Bar__Main">
      <CustomProperties colorScheme="dark">
        <TopBar
          showNavigationToggle
          onNavigationToggle={() => setIsNavMenuOpen((current) => !current)}
          userMenu={userMenuEl}
          secondaryMenu={secondaryMenuEl}
        />
      </CustomProperties>
      <MtNavMenu
        open={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onOpen={() => setIsNavMenuOpen(true)}
      />
    </div>
  );
}
