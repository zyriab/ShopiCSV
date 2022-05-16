import React, { useState, useContext } from 'react';
import store from 'store2';
import { useAuth0 } from '@auth0/auth0-react';
import { MtDarkModeSwitch } from '../MtDarkModeSwitch/MtDarkModeSwitch';
import { MtAuthenticationBtn } from '../AuthButtons/MtAuthenticationBtn';
// TODO: add user image + popover menu (settings, log out, etc)
import { MtLanguageSelector } from '../MtLanguageSelector/MtLanguageSelector';
import { ActionListItemDescriptor, Icon, TopBar } from '@shopify/polaris';
import { useSearch } from '../../utils/hooks/useSearch';
import { useTranslation } from 'react-i18next';
import { RowData } from '../../definitions/custom';
import dataContext from '../../utils/contexts/data.context';
import {
  HomeMinor,
  LanguageMinor,
  QuestionMarkMinor,
  ExternalSmallMinor,
} from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';

interface MtNavBarProps {
  onModeChange: (isDark: boolean) => void;
}

export function MtNavBar(props: MtNavBarProps) {
  const [, setIsDark] = useState(store.get('themeMode') === 'dark' || false);
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
                content: 'Home',
                icon: HomeMinor,
                onAction: () => navigate('/'),
              },
            ],
          },
          {
            items: [
              {
                content: 'Translations',
                icon: LanguageMinor,
                onAction: () => navigate('/translator'),
              },
            ],
          },
          {
            items: [
              {
                content: 'How to use ShopiCSV',
                icon: QuestionMarkMinor,
                suffix: <Icon source={ExternalSmallMinor} />,
                onAction: () => window.open('https://metaoist.io/'),
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
  const secondaryMenuEl = <MtLanguageSelector />;

  function handleActivateDarkMode(dark: boolean) {
    setIsDark(dark);
    props.onModeChange(dark);
    if (dark) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
  }

  return (
    <TopBar
      showNavigationToggle
      searchField={searchFieldEl}
      onSearchResultsDismiss={handleClear}
      userMenu={userMenuEl}
      secondaryMenu={secondaryMenuEl}
    />
  );
}
