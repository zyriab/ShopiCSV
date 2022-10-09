import React from 'react';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// @ts-ignore
import editorMain from '../../images/editor-main.png';

export default function EditorRow() {
  const { isXs, isLg, isXl } = useDetectBreakpoints();

  return (
    <Box mx={isXl ? 20 : 4} mt={10} mb={10}>
      <Grid
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isLg || isXl ? 'space-between' : 'center',
        }}>
        <Grid xs={12} sm={8} lg={4}>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  whiteSpace: isXs ? 'normal' : 'nowrap',
                  marginBottom: '5%',
                }}>
                Time to ditch Excel.
              </Typography>
              <Typography variant="h5">
                Translate your Shopify store in a blink, without the hassle of
                working with a nerve-racking spreadsheet app.
              </Typography>
              <Typography variant="h6">
                (forget about those import errors too)
              </Typography>
            </Box>
            <Box>
              <Button
                href="https://demo.shopicsv.app/"
                target="_blank"
                variant="contained"
                size="large"
                disableElevation>
                Try the demo
              </Button>
            </Box>
          </Stack>
        </Grid>
        <Grid xs={12} lg={8}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: isLg || isXl ? 'end' : 'center',
            }}>
            <img
              style={{ maxWidth: '823px' }}
              src={editorMain}
              alt="The ShopiCSV editor"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
