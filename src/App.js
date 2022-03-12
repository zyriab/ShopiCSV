import { useMemo, useState, useEffect } from 'react';
import store from 'store';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditorPage from './pages/Editor';
import Paper from '@mui/material/Paper';
import { MtNavBar } from './components/MtNavBar/MtNavBar';
import { MtFooter } from './components/MtFooter/MtFooter';

import './App.css';

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2ec5d3',
    },
    background: {
      default: '#192231',
      paper: '#24344d',
    },
  },
};

const lightTheme = {
  palette: {
    type: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: 'rgb(220, 0, 78)',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
};

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
        <EditorPage />
        <MtFooter />
      </Paper>
    </ThemeProvider>
  );
}

export default App;
