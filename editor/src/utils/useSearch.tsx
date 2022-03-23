import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { rowData } from '../definitions/definitions';
import debounce from 'lodash.debounce';

export function useSearch(data: rowData[] | string[], searchIndex = 0) {
  const [inputValue, setInputValue] = useState('');
  const [resultIds, setResultIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInput = useCallback(
    (value: string) => {
      console.log(data);
      setIsLoading(true);
      let ids: number[] = [];
      let i: number;
      if (value.trim() !== '') {
        if ((data[0] as rowData)?.data) {
          ids = (data as rowData[])
            .filter((e: rowData) =>
              e.data[searchIndex].trim().includes(value.trim())
            )
            .map((e: rowData) => e.id);
        } else {
          for (const d of data) {
            i = d === value.trim() ? (data as string[]).indexOf(d) : -1;
            if (i !== -1) ids.push(i);
          }
        }
      }

      setResultIds(ids);
      setIsLoading(false);
    },
    [data, searchIndex]
  );

  const debSearch = useMemo(
    () => debounce(searchInput, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, searchIndex, searchInput]
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setInputValue(e.target.value);
    debSearch(e.target.value);
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
