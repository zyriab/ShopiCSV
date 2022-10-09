import { ThemeOptions } from '@mui/material';

const PRIMARY_COLOR = '#178b6e';

export const lightTheme: ThemeOptions = {
  typography: {
    fontFamily: [
      'Exo',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ].join(','),
  },
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: '#5c5f62',
    },
    background: {
      default: '#f6f6f7',
      paper: '#f6f6f7',
    },
    text: {
      primary: '#202223',
    },
  },
};
