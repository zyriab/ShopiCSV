import { useMemo, useState, useEffect } from 'react';
import store from 'store';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditorPage from './pages/Editor';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { MtNavBar } from './components/MtNavBar/MtNavBar';
import { MtFooter } from './components/MtFooter/MtFooter';
import {darkTheme, lightTheme} from './themes/themes';

import './App.css';


function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(
    store.get('themeMode') === 'dark' || prefersDarkMode || false
  );

  const theme = useMemo(
    () => createTheme(isDark ? darkTheme : lightTheme),
    [isDark]
  );

  useEffect(() => {
    if (prefersDarkMode) store.set('themeMode', 'dark');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Paper>
        <MtNavBar onModeChange={setIsDark} />
      <Box sx={{ minHeight: '600px'}}>
        <EditorPage />
      </Box>
        <MtFooter />
      </Paper>
    </ThemeProvider>
  );
}

export default App;
