import React, { useState, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MtDarkModeSwitch } from '../MtDarkModeSwitch/MtDarkModeSwitch';
import { MtAuthenticationBtn } from '../AuthButtons/MtAuthenticationBtn';
// TODO: add user image + popover menu (settings, log out, etc)
import { MtLanguageSelector } from '../MtLanguageSelector/MtLanguageSelector';
import {
  ActionListItemDescriptor,
  CustomProperties,
  Icon,
  Stack,
  TopBar,
} from '@shopify/polaris';
import {
  HomeMinor,
  LanguageMinor,
  QuestionMarkMinor,
  ExternalSmallMinor,
  SettingsMinor,
} from '@shopify/polaris-icons';
import { useSearch } from '../../utils/hooks/useSearch';
import { useTranslation } from 'react-i18next';
import { RowData } from '../../definitions/custom';
import dataContext from '../../utils/contexts/data.context';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import MtNavMenu from '../MtNavMenu/MtNavMenu';

interface MtNavBarProps {
  onModeChange: (isDark: boolean) => void;
}

export default function MtNavBar(props: MtNavBarProps) {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const context = useContext(dataContext);
  const { inputValue, handleChange, handleClear, resultIds } = useSearch(
    context.data,
    5
  );

  const searchFieldEl = (
    <TopBar.SearchField
      onChange={handleChange}
      value={inputValue}
      // onFocus={} // TODO: select all text
      placeholder={t('General.search')}
      showFocusBorder
    />
  );

  const userMenuEl = isAuthenticated ? (
    <div style={{ marginLeft: '5px' }}>
      <TopBar.UserMenu
        actions={[
          {
            items: [
              {
                content: 'Settings',
                icon: SettingsMinor,
                onAction: () => navigate('/settings'),
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
    <div style={{ width: '250px', display: 'flex', justifyContent: 'center' }}>
      <MtAuthenticationBtn />
    </div>
  );

  // TODO: implement editor filtering (search, fields type, toggle fields)
  const secondaryMenuEl = (
    <Stack wrap={false} alignment="center">
      <MtDarkModeSwitch onChange={props.onModeChange} />
      <MtLanguageSelector />
    </Stack>
  );

  return (
    // FIXME: custom color doesn't apply
    // <CustomProperties style={{ backgroundColor: '#1976d2' }}>
    <>
      <TopBar
        showNavigationToggle
        // searchField={searchFieldEl}
        // onSearchResultsDismiss={handleClear}
        onNavigationToggle={() => setIsNavMenuOpen((current) => !current)}
        userMenu={userMenuEl}
        secondaryMenu={secondaryMenuEl}
      />
      <MtNavMenu
        open={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        onOpen={() => setIsNavMenuOpen(true)}
      />
    </>
    // </CustomProperties>
  );
}
