import { createContext } from 'react';
import { ColorScheme } from '@shopify/polaris/build/ts/latest/src/tokens';
import { lightTheme } from '../../themes/themes';

export default createContext({
  theme: lightTheme,
  themeStr: 'light' as ColorScheme,
  isDark: false,
  activateDarkTheme: (active: boolean) => {},
});
