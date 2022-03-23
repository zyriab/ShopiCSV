import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from 'material-ui-confirm';
import TranslatorPage from './pages/Translator';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useDarkMode } from './utils/useDarkMode';
import { MtNavBar } from './components/MtNavBar/MtNavBar';
import { MtFooter } from './components/MtFooter/MtFooter';

import './App.css';

function App() {
  const darkMode = useDarkMode();
  return (
    <ThemeProvider theme={darkMode.theme}>
      <ConfirmProvider>
        <Paper>
          <MtNavBar onModeChange={darkMode.setIsDark} />
          <Box sx={{ minHeight: '600px' }}>
            <TranslatorPage />
          </Box>
          <MtFooter />
        </Paper>
      </ConfirmProvider>
    </ThemeProvider>
  );
}

export default App;
