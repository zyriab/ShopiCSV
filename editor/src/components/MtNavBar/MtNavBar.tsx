import React, { useState } from 'react';
import store from 'store2';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { MtDarkModeSwitch } from '../MtDarkModeSwitch/MtDarkModeSwitch';
import { MtAuthenticationBtn } from '../AuthButtons/MtAuthenticationBtn';

import { MtLanguageSelector } from '../MtLanguageSelector/MtLanguageSelector';

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

interface AppProps {
  onModeChange: (isDark: boolean) => void;
}

export function MtNavBar(props: AppProps) {
  const [, setIsDark] = useState(store.get('themeMode') === 'dark' || false);
  const { isAuthenticated } = useAuth0();

  function handleActivateDarkMode(dark: boolean) {
    setIsDark(dark);
    props.onModeChange(dark);
    if (dark) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
  }

  return (
    <>
      <HideOnScroll>
        <AppBar
          enableColorOnDark
          color="primary"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
          <Toolbar>
            <Grid container direction="row" alignItems="center">
              <Grid xs={1.5} item>
                <Typography variant="h6" component="div">
                  ShopiCSV 🤠
                </Typography>
              </Grid>
              <Grid item>
                <MtDarkModeSwitch onChange={handleActivateDarkMode} />
              </Grid>
              <Grid item>
                <MtLanguageSelector />
              </Grid>
              <Grid item>
                <NavLink to="/">Home</NavLink>
              </Grid>
              {isAuthenticated && (
                <Grid item>
                  <NavLink to="/translator">Translator</NavLink>
                </Grid>
              )}
              <Grid item>
                <MtAuthenticationBtn />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
}
