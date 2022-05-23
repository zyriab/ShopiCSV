import React, { useState, useEffect, useMemo } from 'react';
import store from 'store2';
import useMediaQuery from '@mui/material/useMediaQuery';
import ThemeContext from '../../utils/contexts/theme.context';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import {
  createTheme,
  ThemeProvider as MuiProvider,
} from '@mui/material/styles';
import { darkTheme, lightTheme } from '../../themes/themes';
import { getPolarisLocale } from '../../utils/tools/getPolarisLocale.utils';

interface MtThemeProviderProps {
  children: React.ReactNode;
}

export default function MtThemeProvider(props: MtThemeProviderProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDark, setIsDark] = useState(
    store.get('themeMode') === 'dark' ||
      (store.get('themeMode') == null && prefersDarkMode) ||
      false
  );

  function activateDarkTheme(active: boolean) {
    if (active) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
    setIsDark(active);
  }

  // Used for MUI
  const theme = useMemo(
    () => createTheme(isDark ? darkTheme : lightTheme),
    [isDark]
  );

  useEffect(() => {
    activateDarkTheme(isDark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        activateDarkTheme,
        theme,
        themeStr: isDark ? 'dark' : 'light',
      }}>
      <PolarisProvider
        colorScheme={isDark ? 'dark' : 'light'}
        i18n={getPolarisLocale as any}>
        <MuiProvider theme={theme}>{props.children}</MuiProvider>
      </PolarisProvider>
    </ThemeContext.Provider>
  );
}
