import React from 'react';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import { MtRouter } from './components/MtRouter/MtRouter';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { getPolarisLocale } from './utils/tools/getPolarisLocale.utils';
import { useDarkMode } from './utils/hooks/useDarkMode';
import { MtNavBar } from './components/MtNavBar/MtNavBar';
import { MtFooter } from './components/MtFooter/MtFooter';

import './App.css';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  const darkMode = useDarkMode();
  return (
    <PolarisProvider i18n={getPolarisLocale as any}>
      <ThemeProvider theme={darkMode.theme}>
        <ConfirmProvider>
          <Paper>
            <MtNavBar onModeChange={darkMode.setIsDark} />
            <Box sx={{ minHeight: '600px' }}>
              <MtRouter />
            </Box>
            <MtFooter />
          </Paper>
        </ConfirmProvider>
      </ThemeProvider>
    </PolarisProvider>
  );
}

export default App;
