import React, { useState, useCallback, useMemo, useEffect } from 'react';
import createWorker from 'workerize-loader!../workers/searchStrArray.worker'; // eslint-disable-line import/no-webpack-loader-syntax
import * as SearchStrArrayWorker from '../workers/searchStrArray.worker';
import { rowData } from '../../definitions/definitions';
import debounce from 'lodash.debounce';

export function useSearch(data: rowData[] | string[], searchIndex = 0) {
  const [inputValue, setInputValue] = useState('');
  const [resultIds, setResultIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInput = useCallback(
    async (value: string) => {
      // FIXME: method object of searchStrArray is empty on compilation (TS only)
      const searchStrArray = createWorker<typeof SearchStrArrayWorker>();
      const ids = await searchStrArray.searchStrArray(
        value,
        data,
        searchIndex
      );
      setIsLoading(false);
      setResultIds(ids);
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
