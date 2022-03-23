import React, { useState, useCallback, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';

export function useSearch(data: string[][] | string[], searchIndex = 0) {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string[]>([])
  const [resultIds, setResultIds] = useState<number[]>([]);

  const searchInput = useCallback(
    (value: string) => {
      if(value.trim() !== ''){
        const ids = [];
        let i: number;
        if (data)
          for (let d of data) {
            if (Array.isArray(d))
              i = d.findIndex((e: any) => e[searchIndex].trim().includes(value.trim()));
            else i = d === value.trim() ? (data as string[]).indexOf(d) : -1;
            if (i !== -1) {
              ids.push(i);
              setResult(current => [...current, value.trim()])
            }
          }
        setResultIds(ids);
      }
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
  }

  useEffect(() => {
    return () => debSearch.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inputValue,
    result,
    resultIds,
    handleChange,
    handleClear,
  };
}
