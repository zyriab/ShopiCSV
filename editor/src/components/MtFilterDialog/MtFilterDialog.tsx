import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterType } from '../../definitions/custom';
import { useTheme, styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete, {
  AutocompleteCloseReason,
  autocompleteClasses,
} from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

interface MtFilterDialogProps {
  filters: FilterType[];
  selected: FilterType[];
  onClose: (selection: FilterType[], showOutdated: boolean) => void;
  anchorEl: any;
}

const StyledAutocompletePopper = styled('div')(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: 'none',
    margin: 0,
    color: 'inherit',
    fontSize: 13,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    backgroundColor:
      theme.palette.mode === 'light'
        ? '#fff'
        : theme.palette.background.default,
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: 'auto',
      alignItems: 'flex-start',
      padding: 8,
      borderBottom: `1px solid  ${
        theme.palette.mode === 'light' ? ' #eaecef' : '#30363d'
      }`,
      '&[aria-selected="true"]': {
        backgroundColor: 'transparent',
      },
      '&[data-focus="true"], &[data-focus="true"][aria-selected="true"]': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: 'relative',
  },
}));

const StyledPopper = styled(Popper)(({ theme }) => ({
  border: `1px solid ${theme.palette.mode === 'light' ? '#e1e4e8' : '#30363d'}`,
  boxShadow: `0 8px 24px ${
    theme.palette.mode === 'light' ? 'rgba(149, 157, 165, 0.2)' : 'rgb(1, 4, 9)'
  }`,
  borderRadius: 6,
  zIndex: theme.zIndex.modal,
  fontSize: 13,
  color: theme.palette.mode === 'light' ? '#24292e' : '#c9d1d9',
  backgroundColor: theme.palette.background.default, //theme.palette.mode === 'light' ? '#fff' : '#1c2128',
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  padding: 10,
  width: '100%',
  borderBottom: `1px solid ${
    theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
  }`,
  '& input': {
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#0d1117',
    padding: 8,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    border: `1px solid ${
      theme.palette.mode === 'light' ? '#eaecef' : '#30363d'
    }`,
    fontSize: 14,
    '&:focus': {
      boxShadow: `0px 0px 0px 3px ${
        theme.palette.mode === 'light'
          ? 'rgba(3, 102, 214, 0.3)'
          : 'rgb(12, 45, 107)'
      }`,
      borderColor: theme.palette.mode === 'light' ? '#0366d6' : '#388bfd',
    },
  },
}));

function PopperComponent(props: PopperComponentProps) {
  const { disablePortal, anchorEl, open, ...other } = props;
  return <StyledAutocompletePopper {...other} />;
}

export default function MtFilterDialog(props: MtFilterDialogProps) {
  const [pendingValue, setPendingValue] = useState<FilterType[]>([]);
  const [isAllToggled, setIsAllToggled] = useState(
    props.selected.length === props.filters.length
  );
  const [showOutdated, setShowOutdated] = useState(false);

  const theme = useTheme();
  const { t } = useTranslation();

  const open = Boolean(props.anchorEl);
  const id = open ? 'filter-fields' : undefined;

  function handleClose() {
    props.onClose(pendingValue, showOutdated);
  }

  function handleToggleAll(event: React.ChangeEvent<HTMLInputElement>) {
    setIsAllToggled(event.target.checked);

    if (event.target.checked) {
      setPendingValue(props.filters);
      return;
    }

    setPendingValue([]);
  }

  function handleShowOutdated(event: React.ChangeEvent<HTMLInputElement>) {
    setShowOutdated(event.target.checked);

    if (event.target.checked) {
    }
  }

  useEffect(() => {
    setPendingValue(props.selected);
  }, [props.selected]);

  return (
    <StyledPopper
      id={id}
      open={open}
      anchorEl={props.anchorEl}
      placement="bottom-start"
      sx={{ width: '33vw' }}>
      <ClickAwayListener onClickAway={handleClose}>
        <div>
          <Stack direction="row" justifyContent="space-between">
            <Box
              sx={{
                padding: '8px 10px',
                fontWeight: 600,
              }}>
              {t('FilterDialog.title')}
            </Box>
            <Stack>
              <FormGroup sx={{ marginRight: '4ch' }}>
                {/* TOGGLE ALL switch */}
                <FormControlLabel
                  control={
                    <Switch checked={isAllToggled} onChange={handleToggleAll} />
                  }
                  label={
                    <FormLabel sx={{ fontSize: '0.9rem' }}>
                      {t('FilterDialog.toggleAllSwitch')}
                    </FormLabel>
                  }
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOutdated}
                      onChange={handleShowOutdated}
                    />
                  }
                  label={
                    <FormLabel sx={{ fontSize: '0.9rem' }}>
                      {t('FilterDialog.showOutdated')}
                    </FormLabel>
                  }
                  labelPlacement="start"
                />
              </FormGroup>
            </Stack>
          </Stack>
          <Autocomplete
            open
            multiple
            onClose={(
              event: React.ChangeEvent<{}>,
              reason: AutocompleteCloseReason
            ) => {
              if (reason === 'escape') {
                handleClose();
              }
            }}
            value={pendingValue}
            onChange={(event, newValue, reason) => {
              if (
                event.type === 'keydown' &&
                (event as React.KeyboardEvent).key === 'Backspace' &&
                reason === 'removeOption'
              ) {
                return;
              }

              setIsAllToggled(newValue.length === props.filters.length);
              setPendingValue(newValue);
            }}
            disableCloseOnSelect
            PopperComponent={PopperComponent}
            renderTags={() => null}
            noOptionsText={t('FilterDialog.noOptionsText')}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Box
                  component={DoneIcon}
                  sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                  style={{
                    visibility: selected ? 'visible' : 'hidden',
                  }}
                />
                <Box
                  sx={{
                    flexGrow: 1,
                    '& span': {
                      color:
                        theme.palette.mode === 'light' ? '#586069' : '#8b949e',
                    },
                  }}>
                  {option?.type}
                  <br />
                  <span>{option?.description}</span>
                </Box>
                <Box
                  component={CloseIcon}
                  sx={{ opacity: 0.6, width: 18, height: 18 }}
                  style={{
                    visibility: selected ? 'visible' : 'hidden',
                  }}
                />
              </li>
            )}
            options={[...props.filters].sort((a, b) => {
              // Displays the selected labels first.
              let ai = props.selected.indexOf(a);
              ai =
                ai === -1
                  ? props.selected.length + props.filters.indexOf(a)
                  : ai;
              let bi = props.selected.indexOf(b);
              bi =
                bi === -1
                  ? props.selected.length + props.filters.indexOf(b)
                  : bi;
              return ai - bi;
            })}
            getOptionLabel={(option) => option?.type || 'option'}
            renderInput={(params) => (
              <StyledInput
                ref={params.InputProps.ref}
                inputProps={{
                  style: { textTransform: 'uppercase' },
                  ...params.inputProps,
                }}
                autoFocus
                placeholder={t('FilterDialog.searchPlaceholder')}
              />
            )}
          />
        </div>
      </ClickAwayListener>
    </StyledPopper>
  );
}
