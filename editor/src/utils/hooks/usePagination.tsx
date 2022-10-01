import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import store from 'store2';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { Key, Pagination, TextField } from '@shopify/polaris';

export function usePagination(dataLength: number, maxElemStorageId: string) {
  const [selectedPage, setSelectedPage] = useState(1);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [maxElementsPerPage, setMaxElementsPerPage] = useState(
    store.get(`${maxElemStorageId}`) === 0
      ? dataLength
      : store.get(`${maxElemStorageId}`) || 8
  );
  const [maxPageNum, setMaxPageNum] = useState(
    maxElementsPerPage !== 0
      ? Math.round((dataLength - 1) / maxElementsPerPage) || 1
      : 1
  );
  const [pageContent, setPageContent] = useState<React.ReactNode[]>([]);
  const [goToPageInputVal, setGoToPageInputVal] = useState('');
  const previousPageNum = useRef<number>(null!);
  const isHandling = useRef(false);

  function handleGoToPageInputChange(value: string) {
    setGoToPageInputVal(value);
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

  function changeDisplayedPage(n: number) {
    let p;
    if (n > maxPageNum) p = maxPageNum;
    else if (n <= 0) p = 1;
    else p = n;

    goToPage(p);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeDisplayedPage = useCallback(
    debounce(changeDisplayedPage, 300),
    [maxPageNum]
  );

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
  const throttledGoNextPage = useCallback(throttle(_nextPage, 200), [
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledGoPrevPage = useCallback(throttle(_prevPage, 200), [
    maxPageNum,
    debouncedChangeDisplayedPage,
  ]);

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
          if (n > maxPageNum) n = maxPageNum;
          else if (+goToPageInputVal <= 0) n = 1;
          goToPage(n);
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
        ? Math.ceil((dataLength - 1) / maxElementsPerPage)
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
    max: maxPageNum,
    value: goToPageInputVal,
    onChange: handleGoToPageInputChange,
  };

  const changePageButtonsProps = {
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

function ChangePageButtons(props: ChangePageBtnsProps) {
  return (
    <Pagination
      hasNext
      hasPrevious
      onNext={props.goNextPage}
      onPrevious={props.goPrevPage}
      label={`${props.currentPageNum}/${props.maxPageNum}`}
      nextKeys={[Key.RightArrow]}
      previousKeys={[Key.LeftArrow]}
    />
  );
}
interface GoToPageFieldProps {
  value: string;
  max: number;
  onChange: (value: string, id: string) => void;
}

function GoToPageField(props: GoToPageFieldProps) {
  const { t } = useTranslation();

  return (
    <TextField
      id="go-to-page-field"
      label={t('Pagination.goToPageLabel')}
      type="number"
      inputMode="numeric"
      min={1}
      max={props.max}
      helpText={t('Pagination.goToPageHelpTxt')}
      value={props.value}
      onChange={props.onChange}
      autoComplete="off"
      selectTextOnFocus
    />
  );
}
