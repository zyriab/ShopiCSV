import React, { useState, useCallback, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';

export function useSearch(data: string[][] | string[], searchIndex = 0) {
  const [inputValue, setInputValue] = useState('');
  const [resultIds, setResultIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInput = useCallback(
    (value: string) => {
      setIsLoading(true);
      let ids: number[] = [];
      if (value.trim() !== '') {
        if (Array.isArray(data[0])) {
          ids = data.map((e, i) =>
            e[searchIndex].trim().includes(value.trim()) ? i : -1
          );
        } else {
          for (const d of data) {
            ids.push(d === value.trim() ? (data as string[]).indexOf(d) : -1);
          }
        }
        ids = ids.filter((i) => i !== -1);
      } else ids = [];

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
