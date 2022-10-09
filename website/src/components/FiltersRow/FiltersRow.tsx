import React from 'react';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// @ts-ignore
import filters from '../../images/filters.png';

export default function FiltersRow() {
  const { isXs, isLg, isXl } = useDetectBreakpoints();

  const text = (
    <Grid
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isLg || isXl ? 'start' : 'end',
        marginTop: isLg || isXl ? 0 : 3,
      }}
      xs={12}
      lg={6}>
      <Box sx={{ width: '90%' }}>
        <Typography variant="h5">
          Filter and navigate easily through your file without getting lost or
          frustrated, thanks to unique tools and a customizable interface.
        </Typography>
      </Box>
    </Grid>
  );

  return (
    <Box mx="10%" mt={10}>
      <Grid
        container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isLg || isXl ? '' : 'center',
        }}>
        {(isLg || isXl) && text}
        <Grid xs={12} lg={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: isLg || isXl ? 'end' : 'center',
            }}>
            <img
              style={{ maxWidth: '725px' }}
              src={filters}
              alt="Closeup on the filtering tools and text fields"
            />
          </Box>
        </Grid>
        {!(isLg || isXl) && text}
      </Grid>
    </Box>
  );
}
