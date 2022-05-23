import { useEffect, useMemo, useState } from 'react';
import store from 'store2';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material/styles';
import { darkTheme, lightTheme } from '../../themes/themes';

export default function useDarkMode() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(
    store.get('themeMode') === 'dark' ||
      (store.get('themeMode') == null && prefersDarkMode) ||
      false
  );

  function activateDarkTheme(dark: boolean) {
    if (dark) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
    setIsDark(dark);
  }

  // Used for MUI
  const theme = useMemo(
    () => createTheme(isDark ? darkTheme : lightTheme),
    [isDark]
  );

  useEffect(() => {
    if (isDark) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    theme,
    isDark,
    activateDarkTheme,
  };
}
