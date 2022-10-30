import React from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// TODO: i18n
export function MtFooter() {
  const theme = useTheme();
  return (
    <footer>
      <Box
        px={{ xs: 3, sm: 5 }}
        pt={{ xs: 5, sm: 3 }}
        pb={{ xs: 2 }}
        bgcolor={theme.palette.primary.main}
        color="#e8e8e8">
        <Container>
          <Stack
            direction="row"
            justifyContent="center"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={3}>
            <Link sx={{ color: '#e8e8e8' }} href="http://www.metaoist.io/">
              Metaoist.io
            </Link>
            <Link sx={{ color: '#e8e8e8' }} href="/">
              Our products
            </Link>
            <Link sx={{ color: '#e8e8e8' }} href="/">
              About us
            </Link>
          </Stack>
          <Box pt={{ xs: 2 }} pb={{ xs: 5, sm: 0 }} textAlign="center">
            <Typography variant="subtitle1">
              Made with 👶 @ Metaoist Dsgn - {new Date().getFullYear()}
            </Typography>
          </Box>
        </Container>
      </Box>
    </footer>
  );
}
