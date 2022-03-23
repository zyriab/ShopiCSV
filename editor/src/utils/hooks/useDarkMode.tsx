import {useEffect, useMemo, useState} from 'react';
import { createTheme } from '@mui/material/styles';
import store from 'store2';
import useMediaQuery from '@mui/material/useMediaQuery';
import { darkTheme, lightTheme } from '../../themes/themes';

// FIXME: sometimes store.get doesn't get it right (too soon?)
export function useDarkMode() {
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
  }, [prefersDarkMode]);

  return {
    theme,
    isDark,
    setIsDark,
  }
}