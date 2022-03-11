import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export function MtRowsDisplayControl(props) {
  const { maxRowDisplay, handleRowsDisplayChange } = props;

  return (
    <Grid xs container item>
      <Grid item>
        <Typography variant="paragraph" component="p">
          Display rows per:
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant={maxRowDisplay === 2 ? 'outlined' : ''}
          onClick={() => handleRowsDisplayChange(2)}>
          2
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant={maxRowDisplay === 4 ? 'outlined' : ''}
          onClick={() => handleRowsDisplayChange(4)}>
          4
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant={maxRowDisplay === 8 ? 'outlined' : ''}
          onClick={() => handleRowsDisplayChange(8)}>
          8
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant={maxRowDisplay === 16 ? 'outlined' : ''}
          onClick={() => handleRowsDisplayChange(16)}>
          16
        </Button>
      </Grid>
    </Grid>
  );
}
