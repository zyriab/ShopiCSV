import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import getLangText from '../../utils/getLangText.utils';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import debounce from 'lodash.debounce';

import './LanguageSelector.css';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.resolvedLanguage);
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(1);

  const isMounted = useRef<boolean>(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHideFn = useCallback(debounce(hideFn, 200), []);

  function hideFn() {
    if (!isMounted.current) {
      return;
    }

    // when user is at the bottom of the page
    document.documentElement.scrollHeight - window.innerHeight <=
      document.documentElement.scrollTop + 10 ||
    document.documentElement.scrollHeight - window.innerHeight <=
      document.body.scrollTop + 10
      ? setHide(0)
      : setHide(1);
  }

  const language = {
    en: 'en',
    fr: 'fr',
  };

  const options = [
    {
      active: selected === language.en,
      content: getLangText(language.en).text,
      value: language.en,
      icon: getLangText(language.en).flag,
      onAction: () => handleSelect(language.en),
    },
    {
      active: selected === language.fr,
      content: getLangText(language.fr).text,
      value: language.fr,
      icon: getLangText(language.fr).flag,
      onAction: () => handleSelect(language.fr),
    },
  ];

  const selectorEl = (
    <Button
      sx={{ opacity: hide }}
      id="lng-button"
      variant="outlined"
      startIcon={getLangText(selected).flag}
      onClick={toggleShow}>
      {getLangText(selected).text} ▼
    </Button>
  );

  function toggleShow() {
    setShow((current) => !current);
  }

  function handleSelect(value: string) {
    setSelected(value);
    i18n.changeLanguage(`${value}`);
    toggleShow();
  }

  useEffect(() => {
    isMounted.current = true;
    options.sort((a, b) => a.value.localeCompare(b.value));
    window.addEventListener('scroll', debouncedHideFn);

    return () => {
      isMounted.current = false;
      debouncedHideFn.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      {selectorEl}
      {show && (
        <ClickAwayListener onClickAway={() => setShow(false)}>
          <Paper id="lng-menu" sx={{ opacity: hide }}>
            <Stack sx={{ display: 'flex', alignItems: 'start' }}>
              {options.map((o) => {
                return (
                  <Button
                    key={o.value}
                    onClick={o.onAction}
                    sx={{
                      borderRadius: 0,
                      borderLeft: o.active
                        ? '3px solid #178b6e'
                        : '3px solid transparent',
                      width: '250px',
                      justifyContent: 'start'
                    }}>
                    <Stack direction="row" spacing={1}>
                      <div>{o.icon}</div>
                      <div>{o.content}</div>
                    </Stack>
                  </Button>
                );
              })}
            </Stack>
          </Paper>
        </ClickAwayListener>
      )}
    </Stack>
  );
}
