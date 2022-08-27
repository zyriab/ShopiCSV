import { useEffect, useRef, useContext } from 'react';
import useDetectScreenSize from './useDetectScreenSize';
import themeContext from '../contexts/theme.context';
import { navBarLogo, lightBgLogo, darkBgLogo } from '../helpers/logo.helper';
import { Logo } from '@shopify/polaris/build/ts/latest/src/utilities/frame/types';

export default function useLogo(): Logo {
  const logo = useRef(navBarLogo);

  const { isDesktop } = useDetectScreenSize();
  const { isDark } = useContext(themeContext);

  // TODO: resize SVG file

  // useEffect(() => {
  //   if (isDesktop) {
  //     logo.current = navBarLogo;
  //   } else if (!isDesktop && isDark) {
  //     logo.current = darkBgLogo;
  //   } else if (!isDesktop && !isDark) {
  //     logo.current = lightBgLogo;
  //   }
  // }, [isDark, isDesktop]);

  logo.current = {
    width: 124,
    topBarSource:
      'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
    url: 'http://jadedpixel.com',
    accessibilityLabel: 'Jaded Pixel',
  };

  return logo.current;
}
