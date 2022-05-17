import React from 'react';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { MtRouter } from './components/MtRouter/MtRouter';
import Box from '@mui/material/Box';
import { Frame } from '@shopify/polaris';
import { getPolarisLocale } from './utils/tools/getPolarisLocale.utils';
import { useDarkMode } from './utils/hooks/useDarkMode';
import { MtNavBar } from './components/MtNavBar/MtNavBar';
import { MtFooter } from './components/MtFooter/MtFooter';

import './App.css';
import '@shopify/polaris/build/esm/styles.css';
import MtNavMenu from './components/MtNavMenu/MtNavMenu';

function App() {
  const darkMode = useDarkMode();
  return (
    <PolarisProvider
      colorScheme={darkMode.isDark ? 'dark' : 'light'}
      i18n={getPolarisLocale as any}>
      {/* <ThemeProvider theme={darkMode.theme}> */}
        <Frame topBar={<MtNavBar onModeChange={darkMode.setIsDark} />} navigation={<MtNavMenu />}>
          <ConfirmProvider>
            <Box sx={{ minHeight: '600px' }}>
              <MtRouter />
            </Box>
            <MtFooter />
          </ConfirmProvider>
        </Frame>
      {/* </ThemeProvider> */}
    </PolarisProvider>
  );
}

export default App;
