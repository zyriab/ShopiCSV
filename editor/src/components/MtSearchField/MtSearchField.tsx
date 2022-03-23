import React, { useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { useSearch } from '../../utils/useSearch';


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
  data: string[][];
  filteredDataIds: (n: number[]) => void;
}

export function MtSearchField(props: AppProps) {
  // TODO: implement async/loading to make the UX more seamless
  // TODO: display number of elements found
  // TODO: set index based on selected filter ? (something like that?)
  const search = useSearch(props.data, 5);
  const { inputValue, resultIds, handleChange, handleClear } = search;

  useEffect(() => props.filteredDataIds(resultIds), [props, resultIds]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        value={inputValue}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              sx={{
                visibility: inputValue.length === 0 ? 'hidden' : 'visible',
              }}
              onClick={handleClear}>
              <ClearIcon sx={{ color: 'white' }} />
            </IconButton>
          </InputAdornment>
        }
      />
    </Search>
  );
}
