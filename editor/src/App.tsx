import React, { useRef, useEffect } from 'react';
import { useAuth0 } from './utils/hooks/useAuth0';
import useLogo from './utils/hooks/useLogo';
import { ConfirmProvider } from 'material-ui-confirm';
import MtThemeProvider from './components/MtThemeProvider/MtThemeProvider';
import { MtRouter } from './components/MtRouter/MtRouter';
import { MtFooter } from './components/MtFooter/MtFooter';
import MtNavBar from './components/MtNavBar/MtNavBar';
import { Frame } from '@shopify/polaris';
import { generateSlug } from 'random-word-slugs';
import LogRocket from 'logrocket';

import './App.css';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  const isIdentified = useRef(false);
  const isInit = useRef(false);

  const { isAuthenticated, user } = useAuth0();
  const logo = useLogo();

  /* Setting up user behavior logging */
  useEffect(() => {
    LogRocket.init('8dmljr/shopicsv');
    isInit.current = true;
  }, []);

  useEffect(() => {
    if (isInit.current && isAuthenticated && !isIdentified.current && user) {
      const slug = generateSlug();

      LogRocket.identify(user.nickname || slug, {
        name: user.nickname || slug,
        email: user.email || 'no email available',
      });

      isIdentified.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <MtThemeProvider>
      <Frame logo={logo} topBar={<MtNavBar />}>
        <ConfirmProvider>
          <div style={{ height: '100%' }}>
            <MtRouter />
          </div>
          <MtFooter />
        </ConfirmProvider>
      </Frame>
    </MtThemeProvider>
  );
}

export default App;
