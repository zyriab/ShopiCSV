import React, { useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ConfirmProvider } from 'material-ui-confirm';
import MtThemeProvider from './components/MtThemeProvider/MtThemeProvider';
import { MtRouter } from './components/MtRouter/MtRouter';
import { MtFooter } from './components/MtFooter/MtFooter';
import MtNavBar from './components/MtNavBar/MtNavBar';
import logo from './utils/helpers/logo.helper';
import { Frame } from '@shopify/polaris';
import { generateSlug } from 'random-word-slugs';
import LogRocket from 'logrocket';

import './App.css';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  const isIdentified = useRef(false);

  const { isAuthenticated, user } = useAuth0();

  /* Setting up user behavior logging */
  useEffect(() => {
    LogRocket.init('8dmljr/shopicsv');
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isIdentified.current && user) {
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
          <div className="min-h-600px">
            <MtRouter />
          </div>
          <MtFooter />
        </ConfirmProvider>
      </Frame>
    </MtThemeProvider>
  );
}

export default App;
