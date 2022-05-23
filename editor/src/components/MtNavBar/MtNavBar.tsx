import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';
import useDarkMode from '../../utils/hooks/useDarkMode';
import MtDarkModeSwitch from '../MtDarkModeSwitch/MtDarkModeSwitch';
import { MtAuthenticationBtn } from '../AuthButtons/MtAuthenticationBtn';
import { MtLanguageSelector } from '../MtLanguageSelector/MtLanguageSelector';
import {
  ActionListItemDescriptor,
  CustomProperties,
  // CustomProperties,
  Icon,
  Stack,
  TopBar,
} from '@shopify/polaris';
import {
  QuestionMarkMinor,
  ExternalSmallMinor,
  SettingsMinor,
  LogOutMinor,
} from '@shopify/polaris-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MtNavMenu from '../MtNavMenu/MtNavMenu';
import { Logo } from '@shopify/polaris/build/ts/latest/src/utilities/frame/types';

interface MtNavBarProps {
  logo: Logo;
  onThemeChange: (isDark: boolean) => void;
}

export default function MtNavBar(props: MtNavBarProps) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { t } = useTranslation();
  const { isDark } = useDarkMode();
  const { isAuthenticated, user, logout } = useAuth0();
  const { isMobile } = useDetectScreenSize();
  const navigate = useNavigate();

  const userMenuEl = isAuthenticated ? (
    <div className="ml-05">
      <TopBar.UserMenu
        actions={[
          {
            items: [
              {
                content: t('General.settings'),
                icon: SettingsMinor,
                onAction: () => navigate('/settings'),
              },
              {
                content: t('General.logout'),
                icon: LogOutMinor,
                onAction: () => logout({ returnTo: window.location.origin }),
              },
            ],
          },
          {
            items: [
              {
                content: 'How to use ShopiCSV',
                icon: QuestionMarkMinor,
                suffix: <Icon source={ExternalSmallMinor} />,
                url: 'https://metaoist.io/',
                external: true,
              },
            ] as ActionListItemDescriptor[],
          },
        ]}
        name={user?.nickname || 'Not connected'}
        detail={user?.name}
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

  // TODO: implement editor filtering (search, fields type, toggle fields)
  const secondaryMenuEl = (
    <Stack wrap={false} alignment="center">
      {/* TODO: Try to use the hook in this file directly */}
      {!isMobile && <MtDarkModeSwitch onChange={props.onThemeChange} />}
      <MtLanguageSelector />
    </Stack>
  );

  return (
    // FIXME: custom color doesn't apply
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
        onThemeChange={props.onThemeChange}
        logo={props.logo}
      />
    </div>
  );
}
