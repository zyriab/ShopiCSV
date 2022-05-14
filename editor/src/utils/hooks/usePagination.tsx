import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import store from 'store2';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Button from '@mui/material/Button';

export function usePagination(dataLength: number, maxElemStorageId: string) {
  const [selectedPage, setSelectedPage] = useState(1);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [maxElementsPerPage, setMaxElementsPerPage] = useState(
    store.get(`${maxElemStorageId}`) === 0
      ? dataLength
      : store.get(`${maxElemStorageId}`) || 4
  );
  const [maxPageNum, setMaxPageNum] = useState(
    maxElementsPerPage !== 0
      ? Math.round((dataLength - 1) / maxElementsPerPage) || 1
      : 1
  );
  const [pageContent, setPageContent] = useState<JSX.Element[]>([]);
  const [goToPageInputVal, setGoToPageInputVal] = useState('');
  const [goToPageHelpTxt, setGoToPageHelpTxt] = useState('');
  const previousPageNum = useRef<number>(null!);
  const navigationButtonsEl = useRef<ChangePageBtnsRef>(null!);
  const isHandling = useRef(false);
  const goToPageInputEl: React.RefCallback<HTMLDivElement> = useCallback(
    (e) => {
      if (e) {
        const input = e.children[1].children[0];
        input.addEventListener('blur', () => setGoToPageHelpTxt(''));
        input.addEventListener('focus', () => {
          if (goToPageInputVal !== '') setGoToPageHelpTxt('Press enter');
        });
      }
    },
    [goToPageInputVal]
  );

  function handleGoToPageInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    setGoToPageInputVal(e.target.value);
    if (e.target.value.length === 0) setGoToPageHelpTxt('');
    else setGoToPageHelpTxt('Press return');
  }

  function handleElementsPerPageChange(n: number) {
    const val = n === 0 ? dataLength : n;
    const firstDisplayedFieldIndex =
      selectedPage * maxElementsPerPage - maxElementsPerPage;

    goToPage(val === n ? Math.floor(firstDisplayedFieldIndex / n + 1) : 1);
    setMaxElementsPerPage(val);
    store.set(maxElemStorageId, n);
  }

  const goToPage = useCallback(
    (n) => {
      let p: number;
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

  function changeDisplayedPage(n: number) {
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

  const resetPagination = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  /* KEY BINDINGS */
  const setupPagination = useCallback(() => {
    window.addEventListener('keydown', (e) => {
      if (!isHandling.current) {
        isHandling.current = true;
        if (
          e.code === 'Enter' &&
          !Number.isNaN(+goToPageInputVal) &&
          document.activeElement?.getAttribute('id') === 'go-to-page-field'
        ) {
          let n = +goToPageInputVal;
          if (+goToPageInputVal > maxPageNum) n = maxPageNum;
          else if (+goToPageInputVal <= 0) n = 1;
          goToPage(n);
        } else if (
          (e.code === 'ArrowLeft' || e.code === 'ArrowRight') &&
          document.activeElement?.nodeName !== 'INPUT' &&
          document.activeElement?.nodeName !== 'TEXTAREA'
        ) {
          e.stopImmediatePropagation();
          e.preventDefault();
          if (e.code === 'ArrowLeft') navigationButtonsEl.current?.previous();
          else if (e.code === 'ArrowRight') navigationButtonsEl.current?.next();
        }
      }
      isHandling.current = false;
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
    let val =
      maxElementsPerPage !== 0
        ? Math.round((dataLength - 1) / maxElementsPerPage)
        : 1;
    if (val === 0) val = 1;
    setMaxPageNum(val);
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
    resetPagination,
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

interface ChangePageBtnsProps {
  currentPageNum: number;
  maxPageNum: number;
  goNextPage: () => void;
  goPrevPage: () => void;
}

type ChangePageBtnsRef = {
  next: () => void;
  previous: () => void;
};

const ChangePageButtons = forwardRef<ChangePageBtnsRef, ChangePageBtnsProps>(
  (props: ChangePageBtnsProps, ref) => {
    const leftButtonEl = useRef<HTMLButtonElement>(null!);
    const rightButtonEl = useRef<HTMLButtonElement>(null!);

    useImperativeHandle(ref, () => ({
      next: () => rightButtonEl.current.click(),
      previous: () => leftButtonEl.current.click(),
    }));

    return (
      <Grid
        spacing={2}
        container
        item
        alignItems="center"
        justifyContent="center">
        <Grid item>
          <Button
            ref={leftButtonEl}
            variant="contained"
            onClick={props.goPrevPage}>
            <ArrowBackRoundedIcon />
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" component="div">
            {`${props.currentPageNum} / ${props.maxPageNum}`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            ref={rightButtonEl}
            variant="contained"
            onClick={props.goNextPage}>
            <ArrowForwardRoundedIcon />
          </Button>
        </Grid>
      </Grid>
    );
  }
);

interface GoToPageFieldProps {
  helperText: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  targetRef: React.RefCallback<HTMLDivElement>;
}

function GoToPageField(props: GoToPageFieldProps) {
  return (
    <TextField
      ref={props.targetRef}
      id="go-to-page-field"
      variant="standard"
      type="number"
      label="Go to page"
      sx={{ minHeight: '4.5rem' }}
      helperText={props.helperText}
      value={props.value}
      onChange={props.onChange}
    />
  );
}
