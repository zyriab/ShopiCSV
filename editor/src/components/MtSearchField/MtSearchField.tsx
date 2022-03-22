import React, { useState, useCallback, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

// TODO: implement async/loading to make the UX more seamless
// TODO: display number of elements found

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
  const [inputValue, setInputValue] = useState('');

  const searchInput = useCallback(
    (value: string) => {
      if (value.trim() !== '') {
        const ids = [];
        for (let d of props.data) {
          let i: number;
          // TODO: set index based on selected filter ? (something like that?)
          i = d.findIndex((e) => e[5].trim().includes(value.trim()));
          if (i !== -1) ids.push(i);
        }

        props.filteredDataIds(ids);
      }
    },
    [props]
  );

  const debSearch = useMemo(
    () => debounce(searchInput, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.filteredDataIds, props.data, searchInput]
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setInputValue(e.target.value);
    debSearch(e.target.value);
  }

  useEffect(() => {
    return () => debSearch.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              onClick={() => setInputValue('')}>
              <ClearIcon sx={{ color: 'white' }} />
            </IconButton>
          </InputAdornment>
        }
      />
    </Search>
  );
}
