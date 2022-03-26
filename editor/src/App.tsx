import React from 'react';
import * as dotenv from 'dotenv';
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import {MtRouter} from './components/MtRouter/MtRouter';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useDarkMode } from './utils/hooks/useDarkMode';
import { MtNavBar } from './components/MtNavBar/MtNavBar';
import { MtFooter } from './components/MtFooter/MtFooter';

import './App.css';

function App() {
  dotenv.config();
  const darkMode = useDarkMode();
  return (
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
  );
}

export default App;
