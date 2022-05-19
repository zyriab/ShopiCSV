import { ThemeOptions } from '@mui/material';
import merge from 'lodash.merge';

// TODO: check that all colors comply with Shopify colors (light and dark, very small variations between text primary, action primary, etc)
// Also finish cloning Polaris' Navigation (subheader, etc)

const sharedStyles = {
  typography: {
    fontFamily: [
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
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: matchMedia('(max-width: 800px)').matches
            ? '.1rem .5rem .1rem .5rem'
            : '.07rem .5rem .07rem .5rem',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '0px',
          marginRight: '.5rem',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          fontSize: matchMedia('(max-width: 800px)').matches
            ? '.975rem'
            : '.875rem',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          padding: matchMedia('(max-width: 800px)').matches
            ? '.8rem .5rem .8rem 1rem'
            : '0 .5rem 0 1rem',
          '&.Mui-selected': {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '0.0625rem',
              bottom: '0.0625rem',
              left: '-0.5rem',
              width: '0.1875rem',
              backgroundColor: '#008060',
              borderTopRightRadius: '.25rem',
              borderBottomRightRadius: '.25rem',
            },
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          padding: matchMedia('(max-width: 800px)').matches
            ? '1rem 0 0 1.7rem'
            : '.07rem 0 0 1.7rem',
          fontSize: '.8125rem',
        },
      },
    },
  },
};

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#008060',
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
  ...merge(
    {
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              rightBorder: '0.0625rem solid #e1e3e5',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              borderRadius: '.25rem',
              '&.Mui-selected': {
                color: '#007b5c',
                backgroundColor: '#edeeef',
                '&:hover': {
                  color: '#006c50',
                  backgroundColor: '#f1f2f3',
                },
                '&:active': {
                  color: '#007b5c',
                  backgroundColor: '#edeeef',
                },
              },
              '&:hover': {
                backgroundColor: '#f1f2f3',
              },
              '&:active': {
                backgroundColor: '#edeeef',
              },
              '&.Mui-focusVisible': {
                backGroundColor: '#edeeef',
              },
            },
          },
        },
        MuiListSubheader: {
          styleOverrides: {
            root: {
              color: '#6d7175',
            },
          },
        },
      },
    },
    sharedStyles
  ),
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#008060',
    },
    secondary: {
      main: '#cccccc',
    },
    background: {
      default: '#0b0c0d',
      paper: '#0b0c0d',
    },
    text: {
      primary: '#e3e5e7',
    },
  },
  ...merge(
    {
      components: {
        MuiDrawer: {
          styleOverrides: {
            paper: {
              borderLeft: '0.0625rem solid #454749',
            },
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              '&.Mui-selected': {
                color: '#009e78',
                backgroundColor: '#0b0c0d',
                '&:hover': {
                  backgroundColor: '#0b0c0d',
                },
                '&:active': {
                  color: '#008060',
                  backgroundColor: '#0b0c0d',
                },
                '&.Mui-focusVisible': {
                  backgroundColor: '#0b0c0d',
                  outline: '2px solid #2662b6',
                  borderRadius: '7px',
                },
              },
              '&:hover': {
                backgroundColor: '#0b0c0d',
              },
              '&:active': {
                backgroundColor: '#0b0c0d',
              },
              '&.Mui-focusVisible': {
                backgroundColor: '#0b0c0d',
                outline: '2px solid #2662b6',
                borderRadius: '7px',
              },
            },
          },
        },
        MuiListSubheader: {
          styleOverrides: {
            root: {
              color: '#999fa4',
            },
          },
        },
      },
    },
    sharedStyles
  ),
};
