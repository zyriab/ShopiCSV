import { ThemeOptions } from '@mui/material';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: 'rgb(220, 0, 78)',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: 'white',
          '&.Mui-selected': {
            color: 'white',
          },
        },
      },
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#2ec5d3',
    },
    background: {
      default: '#192231',
      paper: '#24344d',
    },
  },
};
