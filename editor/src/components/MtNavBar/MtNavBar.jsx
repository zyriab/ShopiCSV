import { useState } from 'react';
import store from 'store';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MtDarkModeSwitch } from '../MtDarkModeSwitch/MtDarkModeSwitch';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function MtNavBar(props) {
  const { onModeChange } = props;
  const [isDark, setIsDark] = useState(
    store.get('themeMode') === 'dark' || false
  );

  function handleActivateDarkMode(dark) {
    setIsDark(dark);
    onModeChange(dark);
    if (dark) store.set('themeMode', 'dark');
    else store.set('themeMode', 'light');
  }

  return (
    <>
      <HideOnScroll>
        <AppBar enableColorOnDark color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
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
            </Grid>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </>
  );
}
