import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import store from 'store';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';

// FIXME: need to double-check maxPageNum calculation because it's possible to have an empty page last
export function usePagination(dataLength, maxElemStorageId) {
  const [selectedPage, setSelectedPage] = useState(1);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [maxElementsPerPage, setMaxElementsPerPage] = useState(
    store.get(`${maxElemStorageId}`) || 4
  );
  const [maxPageNum, setMaxPageNum] = useState(
    Math.round(dataLength / maxElementsPerPage) || 1
  );
  const [pageContent, setPageContent] = useState([]);
  const [goToPageInputVal, setGoToPageInputVal] = useState('');
  const [goToPageHelpTxt, setGoToPageHelpTxt] = useState('');
  const previousPageNum = useRef(null);
  const navigationButtonsEl = useRef(null);
  const goToPageInputEl = useCallback(
    (e) => {
      if (e !== null) {
        const input = e.children[1].children[0];
        input.addEventListener('blur', () => setGoToPageHelpTxt(''));
        input.addEventListener('focus', () => {
          if (goToPageInputVal !== '') setGoToPageHelpTxt('Press enter');
        });
      }
    },
    [goToPageInputVal]
  );

  function handleGoToPageInputChange(e) {
    setGoToPageInputVal(e.target.value);
    if (e.target.value.length === 0) setGoToPageHelpTxt('');
    else setGoToPageHelpTxt('Press return');
  }

  function handleElementsPerPageChange(n) {
    setMaxElementsPerPage(n);
    store.set(maxElemStorageId, n);
  }

  const goToPage = useCallback(
    (n) => {
      let p;
      if (n > maxPageNum) p = maxPageNum;
      else if (n <= 0) p = 1;
      else p = n;

      setSelectedPage(p);
      setCurrentPageNum((current) => {
        previousPageNum.current = current;
        return p;
      });
    },
    [maxPageNum]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeDisplayedPage = useCallback(
    debounce(changeDisplayedPage, 300),
    [maxPageNum]
  );

  function changeDisplayedPage(n) {
    let p;
    if (n > maxPageNum) p = maxPageNum;
    else if (n <= 0) p = 1;
    else p = n;

    goToPage(p);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledGoNextPage = useCallback(throttle(_nextPage, 200), [
    maxPageNum,
    debouncedChangeDisplayedPage,
  ]);

  function _nextPage() {
    setCurrentPageNum((current) => {
      previousPageNum.current = current;
      if (current + 1 === maxPageNum + 1) {
        debouncedChangeDisplayedPage(1);
        return 1;
      }

      debouncedChangeDisplayedPage(current + 1);
      return current + 1;
    });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledGoPrevPage = useCallback(throttle(_prevPage, 200), [
    maxPageNum,
    debouncedChangeDisplayedPage,
  ]);

  function _prevPage() {
    setCurrentPageNum((current) => {
      previousPageNum.current = current;
      if (current - 1 === 0) {
        debouncedChangeDisplayedPage(maxPageNum);
        return maxPageNum;
      }
      debouncedChangeDisplayedPage(current - 1);
      return current - 1;
    });
  }

  /* KEY BINDINGS */
  const setupPagination = useCallback(() => {
    window.addEventListener('keydown', (e) => {
      if (
        e.code === 'Enter' &&
        !isNaN(+goToPageInputVal) &&
        e.path[0].getAttribute('id') === 'go-to-page-field'
      ) {
        let n = +goToPageInputVal;
        if (+goToPageInputVal > maxPageNum) n = maxPageNum;
        else if (+goToPageInputVal <= 0) n = 1;
        goToPage(n);
      } else if (
        (e.code === 'ArrowLeft' || e.code === 'ArrowRight') &&
        e.path[0].nodeName !== 'INPUT' &&
        e.path[0].nodeName !== 'TEXTAREA'
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (e.code === 'ArrowLeft') navigationButtonsEl.current?.previous();
        else if (e.code === 'ArrowRight') navigationButtonsEl.current?.next();
      }
    });
  }, [goToPage, goToPageInputVal, maxPageNum]);

  const cancelDelayedCalls = useCallback(() => {
    debouncedChangeDisplayedPage.cancel();
    throttledGoPrevPage.cancel();
    throttledGoNextPage.cancel();
  }, [debouncedChangeDisplayedPage, throttledGoNextPage, throttledGoPrevPage]);

  useEffect(() => {
    previousPageNum.current = 1;
  }, []);

  useEffect(() => {
    setGoToPageInputVal('');
  }, [selectedPage]);

  useEffect(() => {
    setupPagination();
    return () => cancelDelayedCalls();
  }, [setupPagination, cancelDelayedCalls]);

  useEffect(() => {
    setMaxPageNum(Math.round(dataLength / maxElementsPerPage));
  }, [dataLength, maxElementsPerPage]);

  useEffect(() => {
    if (selectedPage > maxPageNum) {
      goToPage(maxPageNum);
    }
  }, [maxPageNum, goToPage, selectedPage]);

  /* COMPONENTS PROPS */
  const goToPageFieldProps = {
    targetRef: goToPageInputEl,
    value: goToPageInputVal,
    helperText: goToPageHelpTxt,
    onChange: handleGoToPageInputChange,
  };

  const changePageButtonsProps = {
    ref: navigationButtonsEl,
    currentPageNum,
    maxPageNum,
    goNextPage: throttledGoNextPage,
    goPrevPage: throttledGoPrevPage,
  };

  return {
    previousPageNum,
    selectedPage,
    maxElementsPerPage,
    handleElementsPerPageChange,
    pageContent,
    setPageContent,
    GoToPageField,
    goToPageFieldProps,
    ChangePageButtons,
    changePageButtonsProps,
  };
}

const ChangePageButtons = forwardRef((props, ref) => {
  const { currentPageNum, maxPageNum, goNextPage, goPrevPage } = props;
  const leftButtonEl = useRef(null);
  const rightButtonEl = useRef(null);

  useImperativeHandle(ref, () => ({
    next: () => rightButtonEl.current.click(),
    previous: () => leftButtonEl.current.click(),
  }));

  return (
    <Grid spacing={2} container item alignItems="center" justifyContent="center">
      <Grid item>
        <Button ref={leftButtonEl} variant="contained" onClick={goPrevPage}>
          <ArrowBackRoundedIcon />
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1" component="div">
          {`${currentPageNum} / ${maxPageNum}`}
        </Typography>
      </Grid>
      <Grid item>
        <Button ref={rightButtonEl} variant="contained" onClick={goNextPage}>
          <ArrowForwardRoundedIcon />
        </Button>
      </Grid>
    </Grid>
  );
});

function GoToPageField(props) {
  const { helperText, value, onChange, targetRef } = props;

  return (
      <TextField
        ref={targetRef}
        id="go-to-page-field"
        variant="standard"
        type="number"
        label="Go to page"
        sx={{ minHeight: '4.5rem' }}
        helperText={helperText}
        value={value}
        onChange={onChange}
      />
  );
}
