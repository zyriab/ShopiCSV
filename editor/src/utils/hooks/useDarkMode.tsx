import { useEffect, useMemo, useState } from 'react';
import store from 'store2';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material/styles';
import { darkTheme, lightTheme } from '../../themes/themes';

export default function useDarkMode() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(
    store.get('themeMode') === 'dark' || prefersDarkMode || false
  );

  // Used for MUI
  const theme = useMemo(
    () => createTheme(isDark ? darkTheme : lightTheme),
    [isDark]
  );

  useEffect(() => {
    if (prefersDarkMode) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
  }, [prefersDarkMode]);

  useEffect(() => {
    if (isDark) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
  }, [isDark]);

  return {
    theme,
    isDark,
    setIsDark,
  };
}
