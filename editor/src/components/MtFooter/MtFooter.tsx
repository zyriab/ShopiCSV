import React, { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';

export function MtFooter() {
  const theme = useTheme();
  return (
    <footer>
      <Box
        px={{ xs: 3, sm: 5 }}
        pt={{ xs: 5, sm: 5 }}
        pb={{ xs: 2 }}
        bgcolor={theme.palette.primary.main}
        color="white">
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>Navigate</Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  Home
                </Link>
              </Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  Editor
                </Link>
              </Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  My account
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>Metaoist Dsgn</Box>
              <Box>
                <Link sx={{ color: 'white' }} href="http://www.metaoist.io/">
                  Metaoist.io
                </Link>
              </Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  Our products
                </Link>
              </Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  About us
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box borderBottom={1}>Help</Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  How to use ShopiCSV
                </Link>
              </Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  FAQ
                </Link>
              </Box>
              <Box>
                <Link sx={{ color: 'white' }} href="/">
                  Privacy
                </Link>
              </Box>
            </Grid>
            <Grid item xs />
          </Grid>
          <Box textAlign="center"></Box>
          <Box pt={{ xs: 0, sm: 0 }} pb={{ xs: 5, sm: 0 }} textAlign="center">
            <Stack>
              <Paper
                color="dark"
                elevation={0}
                sx={{
                  width: '200px',
                  height: '70px',
                  paddingTop: '0.6rem',
                  margin: 'auto',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  background: '#24344d',
                }}>
                <Link sx={{ color: 'white' }} href="https://www.metaoist.io/">
                  <img
                    src="images/logo/MetaoistWholeLogo.svg"
                    alt="Logo of Metaoist Dsgn"
                    width="200"
                  />
                </Link>
              </Paper>
                Metaoist Dsgn © {new Date().getFullYear()}
            </Stack>
          </Box>
        </Container>
      </Box>
    </footer>
  );
}
