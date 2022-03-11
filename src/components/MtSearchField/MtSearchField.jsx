import { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';

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
      width: '50ch',
    },
  },
}));

export function MtSearchField(props) {
  const { data } = props;
  // const [value, setValue] = useState('');
  // const [results, setResults] = useState([]);
  // const [open, setOpen] = useState(false);

  // const debouncedSearch = useMemo(debounce(search, 600), [data]);

  // function search(val) {
  //   if (val.trim() !== '') {
  //     setResults(data.filter((e) => e.includes(val)));
  //     setOpen(true);
  //   } else setOpen(false);
  // }

  // function handleInput(e) {
  //   setValue(e.target.value);
  //   debouncedSearch(e.target.value);
  // }

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <Autocomplete
          freeSolo
          id="search-field"
          options={data.map((option) =>
            option.data[5] !== 'Default content' ? option.data[5] : ''
          )}
          renderInput={(params) => {
            const { InputLabelProps, InputProps, ...props } = params;
            console.log(params);
            return <StyledInputBase ref={params.InputProps.ref} {...params.InputProps} {...props} />;
          }}
          // <StyledInputBase
          //   ref={params.InputProps.ref}
          //   type="search"
          //   placeholder="Search…"
          //   inputProps={{ ...params.InputProps, 'aria-label': 'search' }}
          // />}
        />
      </Search>
    </>
  );
}
