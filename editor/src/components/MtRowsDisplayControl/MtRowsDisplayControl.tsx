import React from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface AppProps {
  maxRowDisplay: number;
  handleRowsDisplayChange: (n: number) => void;
}

export function MtRowsDisplayControl(props: AppProps) {
  const { t } = useTranslation();
  return (
    <Grid xs container item alignItems="center">
      <Grid item>
        <Typography
          paragraph
          component="p"
          sx={{ paddingBottom: '.3rem', marginRight: '.5rem' }}>
          {t('RowDisplayControl.displayPer')}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant={props.maxRowDisplay === 2 ? 'outlined' : 'text'}
          onClick={() => props.handleRowsDisplayChange(2)}>
          2
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant={props.maxRowDisplay === 4 ? 'outlined' : 'text'}
          onClick={() => props.handleRowsDisplayChange(4)}>
          4
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant={props.maxRowDisplay === 8 ? 'outlined' : 'text'}
          onClick={() => props.handleRowsDisplayChange(8)}>
          8
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant={props.maxRowDisplay === 16 ? 'outlined' : 'text'}
          onClick={() => props.handleRowsDisplayChange(16)}>
          16
        </Button>
      </Grid>
    </Grid>
  );
}
