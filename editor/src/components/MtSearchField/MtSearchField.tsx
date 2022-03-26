import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useSearch } from '../../utils/hooks/useSearch';
import { RowData } from '../../definitions/definitions';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginTop: '1%',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(3),
    width: '33vw',
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
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    marginRight: theme.spacing(2),
  },
}));

interface AppProps {
  data: RowData[];
  filteredDataIds: (n: number[]) => void;
  numOfDisplayedFields: number;
}

export function MtSearchField(props: AppProps) {
  const search = useSearch(props.data, 5);
  const { inputValue, resultIds, isLoading, handleChange, handleClear } =
    search;
  const { t } = useTranslation();

  useEffect(() => props.filteredDataIds(resultIds), [props, resultIds]);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={t('General.search')}
        value={inputValue}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
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
                <CircularProgress size="1.2rem" sx={{ color: 'white' }} />
              ) : (
                <Typography variant="subtitle2">
                  {props.numOfDisplayedFields}
                </Typography>
              )}
            </Box>
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
