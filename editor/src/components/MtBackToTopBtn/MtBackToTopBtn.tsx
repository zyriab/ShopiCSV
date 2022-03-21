import React, { useState, useEffect, useCallback } from 'react';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import IconButton from '@mui/material/IconButton';
import debounce from 'lodash.debounce';

import './MtBackToTopBtn.css';

export function MtBackToTopBtn() {
  const [display, setDisplay] = useState(0);

  function handleScroll() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDisplayFn = useCallback(debounce(displayFn, 200), []);

  function displayFn() {
    document.body.scrollTop > 50 || document.documentElement.scrollTop > 50
      ? setDisplay(1)
      : setDisplay(0);
  }

  useEffect(() => {
    window.addEventListener('scroll', debouncedDisplayFn);
    return () => debouncedDisplayFn.cancel();
  }, [debouncedDisplayFn]);

  return (
    <IconButton
      id="top-btn"
      sx={{ opacity: display }}
      color="primary"
      onClick={handleScroll}>
      <ArrowCircleUpIcon sx={{ fontSize: '3rem' }} />
    </IconButton>
  );
}
