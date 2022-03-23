import React, { useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useSearch } from '../../utils/hooks/useSearch';
import { rowData } from '../../definitions/definitions';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '45ch',
    },
  },
}));

interface AppProps {
  data: rowData[];
  filteredDataIds: (n: number[]) => void;
}

export function MtSearchField(props: AppProps) {
  // TODO: set index based on selected filter ? (something like that?)
  const search = useSearch(props.data, 5);
  const { inputValue, resultIds, isLoading, handleChange, handleClear } =
    search;

  useEffect(() => props.filteredDataIds(resultIds), [props, resultIds]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…" // TODO: i18n
        value={inputValue}
        onChange={handleChange}
        endAdornment={
          <Grid container alignItems="center" justifyContent="end">
            <Grid item>
              <Box
                sx={{
                  visibility: inputValue.length === 0 ? 'hidden' : 'visible',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  width: '1.5rem',
                  height: '1.2rem',
                  padding: '0.2rem 1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '40px',
                }}>
                {isLoading ? (
                  <CircularProgress size="1.2rem" sx={{color: 'white'}} />
                ) : (
                  <Typography variant="subtitle2">
                    {resultIds.length - 2}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item>
              <InputAdornment position="end">
                <IconButton
                  sx={{
                    visibility: inputValue.length === 0 ? 'hidden' : 'visible',
                  }}
                  onClick={handleClear}>
                  <ClearIcon sx={{ color: 'white' }} />
                </IconButton>
              </InputAdornment>
            </Grid>
          </Grid>
        }
      />
    </Search>
  );
}
