import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

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
    // marginLeft: theme.spacing(3),
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
      width: '50ch',
    },
  },
}));

export function MtSearchField(props) {
  const { data, filteredDataIds } = props;
  const [inputValue, setInputValue] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debSearch = useMemo(() => debounce(searchInput, 600), [filteredDataIds, data])
  function searchInput(value) {
    const dt = data.map((e, i) => {
      return { data: e.data[5], id: i };
    });
    if (value.trim() !== '') {
      filteredDataIds(dt.filter((e) => e.data.trim().includes(value.trim())));
    } else {
      filteredDataIds(dt);
    }
  }

  function handleChange(e) {
    setInputValue(e.target.value);
    debSearch(e.target.value);
  }

  useEffect(() => {
    return () => debSearch.cancel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        value={inputValue}
        onChange={handleChange}
      />
    </Search>
  );
}
