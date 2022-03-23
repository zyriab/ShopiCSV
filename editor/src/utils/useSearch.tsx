import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { rowData } from '../definitions/definitions';
import debounce from 'lodash.debounce';

// TODO: implement web worker to search asynchronously
export function useSearch(data: rowData[] | string[], searchIndex = 0) {
  const [inputValue, setInputValue] = useState('');
  const [resultIds, setResultIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInput = useCallback(
    async (value: string) => {
      new Promise((resolve, reject) => {
        let ids: number[] = [];
        let i: number;
        if (value.trim() !== '') {
          if ((data[0] as rowData)?.data) {
            ids = (data as rowData[])
              .filter((e: rowData) =>
                e.data[searchIndex]
                  .trim()
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '')
                  .includes(
                    value
                      .trim()
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/\p{Diacritic}/gu, '')
                  )
              )
              .map((e: rowData) => e.id);
          } else {
            for (const d of data) {
              i =
                (d as string)
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '') ===
                value
                  .trim()
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/\p{Diacritic}/gu, '')
                  ? (data as string[]).indexOf(d as string)
                  : -1;
              if (i !== -1) ids.push(i);
            }
          }
          // Since the index starts on 1 in MtEditorContent we need to start with 0 which will be skipped
          // i.e.: index 0 is 'Type', 'Identification', 'Field', etc on translation CSV
          ids.unshift(0);
        } else ids = [];

        setIsLoading(false);
        resolve(setResultIds(ids));
      });
    },
    [data, searchIndex]
  );

  const debSearch = useMemo(
    async () => debounce(searchInput, 600),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, searchIndex, searchInput]
  );

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setIsLoading(true);
    setInputValue(e.target.value);
    (await debSearch)(e.target.value);
  }

  function handleClear() {
    setInputValue('');
    setResultIds([]);
  }

  useEffect(() => {
    const foo = async () => (await debSearch).cancel();
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
