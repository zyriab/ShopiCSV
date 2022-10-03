import { useEffect, useState, useContext } from 'react';
import useDetectScreenSize from './useDetectScreenSize';
import themeContext from '../contexts/theme.context';
import { navBarLogo, lightBgLogo, darkBgLogo } from '../helpers/logo.helper';
import { Logo } from '@shopify/polaris/build/ts/latest/src/utilities/frame/types';

export default function useLogo(): Logo {
  const [logo, setLogo] = useState(navBarLogo);

  const { isDesktop } = useDetectScreenSize();
  const { isDark } = useContext(themeContext);

  useEffect(() => {
    if (isDesktop) {
      setLogo(navBarLogo);
    } else if (isDark) {
      setLogo(darkBgLogo);
    } else if (!isDark) {
      setLogo(lightBgLogo);
    }
  }, [isDark, isDesktop]);

  return logo;
}
