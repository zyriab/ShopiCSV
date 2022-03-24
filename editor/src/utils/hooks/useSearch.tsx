import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Worker from 'worker-loader!../workers/searchStrArray.worker'; // eslint-disable-line import/no-webpack-loader-syntax
import { rowData } from '../../definitions/definitions';
import debounce from 'lodash.debounce';

export function useSearch(data: rowData[] | string[], searchIndex = 0) {
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
        setIsLoading(false);
        setResultIds(event.data);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setIsLoading(true);
    setInputValue(e.target.value);
    debSearch(e.target.value);
  }

  function handleClear() {
    setInputValue('');
    setResultIds([]);
  }

  useEffect(() => {
    const foo = () => debSearch.cancel();
    return () => {
      foo();
    };
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
