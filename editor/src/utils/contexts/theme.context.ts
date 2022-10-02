import { createContext } from 'react';
import { ColorScheme } from '@shopify/polaris/build/ts/latest/src/tokens';
import { darkTheme } from '../../themes/themes';

export default createContext({
  theme: darkTheme,
  themeStr: 'dark' as ColorScheme,
  isDark: true,
  activateDarkTheme: (active: boolean) => {},
});
