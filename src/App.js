import { ThemeProvider } from '@mui/material/styles';
import EditorPage from './pages/Editor';
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
      <Paper>
        <MtNavBar onModeChange={darkMode.setIsDark} />
        <Box sx={{ minHeight: '600px' }}>
          <EditorPage />
        </Box>
        <MtFooter />
      </Paper>
    </ThemeProvider>
  );
}

export default App;
