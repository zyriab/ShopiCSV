import React from 'react';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// @ts-ignore
import discordLogo from '../../images/discord-logo.svg';

export default function StoryRow() {
  const { isLg, isXl } = useDetectBreakpoints();

  return (
    <Box mx={4} mt={10} mb={5}>
      <Grid container>
        <Grid
          xs={12}
          lg={4}
          sx={{
            margin: isLg || isXl ? 0 : '2% 0',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Stack spacing={2} sx={{ width: '90%' }}>
            <Typography variant="h4" align="center">
              Forged in fire
            </Typography>
            <Typography variant="h6" component="p">
              While working on a Shopify website, as the need to translate our
              content from French to English, our team quickly faced the myriad
              of problems that came with using a spreadsheet app to edit CSV
              files... so we came up with a tool that would make our lives
              easier and, feature after feature, what was a basic prototype
              became ShopiCSV.
            </Typography>
          </Stack>
        </Grid>
        <Grid
          xs={12}
          lg={4}
          sx={{
            margin: isLg || isXl ? 0 : '2% 0',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}>
            <Button
              sx={{ height: isLg || isXl ? '35%' : '100%' }}
              href="https://discord.gg/b9Myw2UmMw"
              target="_blank"
              variant="contained"
              size="large"
              disableElevation>
              <Stack
                sx={{
                  height: isLg || isXl ? '70%' : '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <img style={{ width: 64 }} src={discordLogo} alt="" />
                <Typography variant="subtitle1">
                  <strong>Chat with us on Discord</strong>
                </Typography>
              </Stack>
            </Button>
          </Box>
        </Grid>
        <Grid
          xs={12}
          lg={4}
          sx={{
            margin: isLg || isXl ? 0 : '2% 0',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Stack spacing={2} sx={{ width: '90%' }}>
            <Typography variant="h4" align="center">
              Enjoy direct help from accessible developers
            </Typography>
            <Typography variant="h6" component="p">
              The biggest adventage of using a small startup's app is, you'll
              get to talk to the very person who built the service, making
              resolving issues much easier and faster!
              <br />
              It is also an open source handcrafted project which is great, I
              just have no more functionning brain cell to talk about it but I
              still need to bulk up this paragraph.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
