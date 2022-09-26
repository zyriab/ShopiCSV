import React, { useState, useRef, useEffect, useCallback } from 'react';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import IconButton from '@mui/material/IconButton';
import debounce from 'lodash.debounce';

import './MtBackToTopBtn.css';

export function MtBackToTopBtn() {
  const [display, setDisplay] = useState(0);

  const isMounted = useRef<boolean>(false);

  function handleScroll() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDisplayFn = useCallback(debounce(displayFn, 200), []);

  function displayFn() {
    if (!isMounted.current) {
      return;
    }

    document.body.scrollTop > 50 || document.documentElement.scrollTop > 50
      ? setDisplay(1)
      : setDisplay(0);
  }

  useEffect(() => {
    isMounted.current = true;

    window.addEventListener('scroll', debouncedDisplayFn);
    return () => {
      isMounted.current = false;
      debouncedDisplayFn.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
