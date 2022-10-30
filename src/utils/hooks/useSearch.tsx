import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Worker from 'worker-loader!../workers/searchStrArray.worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { RowData } from '../../definitions/custom';
import debounce from 'lodash.debounce';

export function useSearch(data: RowData[] | string[], searchIndex = 0) {
  const [inputValue, setInputValue] = useState('');
  const [resultIds, setResultIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInput = useCallback(
    async (value: string) => {
      const worker = new Worker();
      worker.postMessage({
        searchValue: value,
        data: data,
        searchIndex: searchIndex,
      });

      worker.addEventListener('message', (event) => {
        setResultIds(event.data);
        // Needed because there's a small latency before the correct numOfDisplayedFields reaches the search input
        setTimeout(() => setIsLoading(false), 500);
        worker.terminate();
      });
    },
    [data, searchIndex]
  );

  const debSearch = useMemo(
    () => debounce(searchInput, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, searchIndex, searchInput]
  );

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string
  ) {
    setIsLoading(true);

    if (typeof e === 'string') {
      setInputValue(e);
      debSearch(e);
    } else {
      setInputValue(e.target.value);
      debSearch(e.target.value);
    }
  }

  function handleClear() {
    setInputValue('');
    setResultIds([]);
  }

  useEffect(() => {
    return () => debSearch.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inputValue,
    resultIds,
    isLoading,
    handleChange,
    handleClear,
  };
}
