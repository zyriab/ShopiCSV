import React from 'react';
import { AppProvider as PolarisProvider, Frame } from '@shopify/polaris';
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { MtRouter } from './components/MtRouter/MtRouter';
import Box from '@mui/material/Box';
import { getPolarisLocale } from './utils/tools/getPolarisLocale.utils';
import useDarkMode from './utils/hooks/useDarkMode';
import { MtFooter } from './components/MtFooter/MtFooter';
import MtNavBar from './components/MtNavBar/MtNavBar';

import './App.css';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  const darkMode = useDarkMode();

  const logo = {
    width: 124,
    topBarSource:
      'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
    url: 'http://jadedpixel.com',
    accessibilityLabel: 'Jaded Pixel',
  };

  return (
    <PolarisProvider
      colorScheme={darkMode.isDark ? 'dark' : 'light'}
      i18n={getPolarisLocale as any}>
      <ThemeProvider theme={darkMode.theme}>
        <Frame logo={logo} topBar={<MtNavBar logo={logo} onThemeChange={darkMode.setIsDark} />}>
          <ConfirmProvider>
            <Box sx={{ minHeight: '600px' }}>
              <MtRouter />
            </Box>
            <MtFooter />
          </ConfirmProvider>
        </Frame>
      </ThemeProvider>
    </PolarisProvider>
  );
}

export default App;
