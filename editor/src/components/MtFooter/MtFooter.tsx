import React from 'react';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import './Footer.css';

export function MtFooter() {
  const { isLg, isXl } = useDetectBreakpoints();

  return (
    <footer style={{ minHeight: '150px' }}>
      <Paper
        square
        elevation={0}
        sx={{
          padding: '0 5%',
          height: isLg || isXl ? '150px' : '100%',
          backgroundColor: '#178b6e',
        }}>
        <Grid
          container
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
          <Grid
            xs={12}
            lg={4}
            sx={{
              display: 'flex',
              justifyContent: isLg || isXl ? 'start' : 'center',
            }}>
            <Stack justifyContent="center" alignItems="center">
              <img
                style={{ width: 200, height: 'auto' }}
                src="/images/logos/shopicsvTextLogo.svg"
                alt="ShopiCSV"
              />
              <Stack direction="row" justifyContent="center" spacing={1}>
                <Link href="https://discord.gg/b9Myw2UmMw" target="_blank">
                  <img
                    style={{ width: 40 }}
                    src="/images/logos/discord-logo.svg"
                    alt="Discord logo"
                  />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/wallenart/"
                  target="_blank">
                  <img
                    style={{ width: 40 }}
                    src="/images/logos/linkedin-logo.svg"
                    alt="Linkedin logo"
                  />
                </Link>
                <Link href="" target="_blank">
                  <img
                    style={{ width: 40 }}
                    src="/images/logos/gh-logo.svg"
                    alt="Github logo"
                  />
                </Link>
              </Stack>
            </Stack>
          </Grid>
          <Grid
            xs={12}
            lg={4}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              margin: isLg || isXl ? 0 : '4% 0 2% 0',
            }}>
            <Stack direction="row" alignItems="center" spacing={3}>
              <Link
                sx={{ color: '#fff' }}
                target="_blank"
                href=""
                className="links">
                Contact
              </Link>
              <Link
                sx={{ color: '#fff' }}
                target="_blank"
                href=""
                className="links">
                About Metaoist Dsgn
              </Link>
            </Stack>
          </Grid>
          <Grid
            xs={12}
            lg={4}
            sx={{
              display: 'flex',
              alignItems: 'end',
              justifyContent: isLg || isXl ? 'end' : 'center',
              height: isLg || isXl ? '100%' : 'auto',
              color: 'white',
            }}>
            <Typography variant="subtitle1">
              Made with 👶 at Metaoist Dsgn © {new Date().getFullYear()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </footer>
  );
}
