import React from 'react';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// @ts-ignore
import fileExplorer from '../../images/file-explorer.png';

export default function FileExplorerRow() {
  const { isLg, isXl } = useDetectBreakpoints();

  return (
    <Box mx="10%" mt={10}>
      <Grid
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isLg || isXl ? '' : 'center',
        }}>
        <Grid xs={12} lg={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: isLg || isXl ? 'start' : 'center',
            }}>
            <img
              style={{ maxWidth: '643px' }}
              src={fileExplorer}
              alt="ShopiCSV's file editor, made with Shopify UI library: Polaris"
            />
          </Box>
        </Grid>
        <Grid
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', marginTop: isLg ||isXl ? 0 : 3 }}
          xs={12}
          lg={6}>
          <Box sx={{ width: '90%' }}>
            <Typography variant="h5" >
              Easily upload, download, manage and even restore previous versions
              of your files, by making use of your dedicated cloud storage,
              directly inside the application.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
