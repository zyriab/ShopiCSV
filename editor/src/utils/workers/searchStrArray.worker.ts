import { rowData } from '../../definitions/definitions';

export function searchStrArray(searchValue: string, data: string[] | rowData[], searchIndex: number) {
  let ids: number[] = [];
  let i: number;
  if (searchValue.trim() !== '') {
    if ((data[0] as rowData)?.data) {
      ids = (data as rowData[])
        .filter((e: rowData) =>
          e.data[searchIndex]
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .includes(
              searchValue
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
          searchValue
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
  return ids;
}
