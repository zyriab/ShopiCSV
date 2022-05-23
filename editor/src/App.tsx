import React from 'react';
import { Frame } from '@shopify/polaris';
import { ConfirmProvider } from 'material-ui-confirm';
import MtThemeProvider from './components/MtThemeProvider/MtThemeProvider';
import { MtRouter } from './components/MtRouter/MtRouter';
import Box from '@mui/material/Box';
import { MtFooter } from './components/MtFooter/MtFooter';
import MtNavBar from './components/MtNavBar/MtNavBar';
import logo from './utils/helpers/logo.helper';

import './App.css';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  return (
    <MtThemeProvider>
      <Frame logo={logo} topBar={<MtNavBar />}>
        <ConfirmProvider>
          <Box sx={{ minHeight: '600px' }}>
            <MtRouter />
          </Box>
          <MtFooter />
        </ConfirmProvider>
      </Frame>
    </MtThemeProvider>
  );
}

export default App;
