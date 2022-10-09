import React from 'react';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// @ts-ignore
import prodBlob from '../../images/prod-blob.png';
// @ts-ignore
import visualBlob from '../../images/visual-blob.png';
// @ts-ignore
import translationBlob from '../../images/translation-blob.png';

export default function RoadmapRow() {
  const { isLg, isXl } = useDetectBreakpoints();

  return (
    <Box mx="10%" mt={15}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" align="center">
            Great! But what's next?
          </Typography>
          <Typography variant="h5" align="center">
            We are constantly working to improve ShopiCSV.
            <br />
            Here are some of the features to come:
          </Typography>
        </Box>
        <Grid
          container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Grid
            xs={12}
            md={4}
            sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 255,
                height: 181,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${prodBlob})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}>
              <Typography variant="h5" align="center">
                A product CSV editor
              </Typography>
            </Box>
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 255,
                height: 181,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${visualBlob})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}>
              <Typography variant="h5" align="center">
                Visual editors for code templates
                <br />
                (email, sms, ...)
              </Typography>
            </Box>
          </Grid>
          <Grid
            xs={12}
            md={4}
            sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 255,
                height: 181,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: `url(${translationBlob})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}>
              <Typography variant="h5" align="center">
                A fully automated translation
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
