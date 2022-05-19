import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { isIOS } from 'react-device-detect';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { Stack } from '@shopify/polaris';
import {
  HomeMinor,
  LanguageMinor,
  ProductsMinor,
  QuestionMarkMinor,
  ThumbsUpMinor,
  ConversationMinor,
} from '@shopify/polaris-icons';
import MtNavItems from '../MtNavItems/MtNavItems';
import MtDarkModeSwitch from '../MtDarkModeSwitch/MtDarkModeSwitch';
import { Logo } from '@shopify/polaris/build/ts/latest/src/utilities/frame/types';

interface MtNavMenuProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onThemeChange: (isDark: boolean) => void;
  logo: Logo;
}

export default function MtNavMenu(props: MtNavMenuProps) {
  const location = useLocation();
  const { isMobile, isTablet } = useDetectScreenSize();
  const { t } = useTranslation();

  const [selected, setSelected] = useState(1);
  const [width] = useState(isMobile ? '90vw' : isTablet ? '75vw' : '300px');

  const mainNavItems = useMemo(
    () => [
      {
        text: t('NavMenu.home'),
        path: '/',
        icon: <HomeMinor />,
        public: true,
      },
      {
        text: t('NavMenu.translations'),
        path: '/translations',
        icon: <LanguageMinor />,
      },
      {
        text: t('NavMenu.products'),
        path: '/products',
        icon: <ProductsMinor />,
      },
    ],
    [t]
  );

  const secondaryNavItems = useMemo(
    () => [
      {
        text: t('NavMenu.help'),
        path: 'https://www.metaoist.io/',
        icon: <QuestionMarkMinor />,
        external: true,
        public: true,
      },
      {
        text: t('NavMenu.discord'),
        path: 'https://discord.com/',
        icon: <ConversationMinor />,
        external: true,
        public: true,
      },
      {
        text: t('NavMenu.review'),
        path: 'https://www.shopicsv.app/review',
        icon: <ThumbsUpMinor />,
      },
    ],
    [t]
  );

  useEffect(() => {
    const index = mainNavItems.indexOf(
      mainNavItems.find((itm) => itm.path === location.pathname) ||
        mainNavItems[0]
    );
    setSelected(index);
    props.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, mainNavItems]);

  return (
    <Drawer
      className="mt-main-menu"
      anchor="left"
      disableBackdropTransition={!isIOS}
      disableDiscovery={isIOS}
      PaperProps={{
        elevation: 0,
      }}
      {...props}>
      <Box sx={{ width }}>
        <div className="pt-1-5">
          {(isMobile || isTablet) && (
            <Stack vertical spacing="extraTight">
              {isTablet && (
                <div className="align-center">
                  <a href={props.logo.url}>
                    <img
                      src={props.logo.topBarSource || ''}
                      width={props.logo.width}
                      alt={props.logo.accessibilityLabel || 'Application Logo'}
                    />
                  </a>
                </div>
              )}
              {isMobile && (
                <div className="align-right pr-1">
                  <MtDarkModeSwitch onChange={props.onThemeChange} />
                </div>
              )}
            </Stack>
          )}
        </div>
        <List dense>
          <MtNavItems
            items={mainNavItems}
            selectedItem={selected}
            setSelectedItem={setSelected}
          />
        </List>
        <List dense>
          <ListSubheader>{t('NavMenu.sectionSeparator')}</ListSubheader>
          <MtNavItems items={secondaryNavItems} />
        </List>
      </Box>
    </Drawer>
  );
}
