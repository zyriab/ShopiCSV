import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isIOS } from 'react-device-detect';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import {
  HomeMinor,
  LanguageMinor,
  ProductsMinor,
  QuestionMarkMinor,
  ThumbsUpMinor,
  ConversationMinor,
} from '@shopify/polaris-icons';
import { useLocation } from 'react-router-dom';
import MtNavItems from '../MtNavItem/MtNavItem';

interface MtNavMenuProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
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
      },
      {
        text: t('NavMenu.discord'),
        path: 'https://discord.com/',
        icon: <ConversationMinor />,
        external: true,
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
        <List dense>
          <MtNavItems
            items={mainNavItems}
            selectedItem={selected}
            setSelectedItem={setSelected}
          />
          <ListSubheader>{t('NavMenu.sectionSeparator')}</ListSubheader>
          <MtNavItems items={secondaryNavItems} />
        </List>
      </Box>
    </Drawer>
  );
}
