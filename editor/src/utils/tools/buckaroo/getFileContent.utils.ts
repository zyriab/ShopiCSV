import Papa from 'papaparse';
import { RowData, TokenizedFileInput } from '../../../definitions/custom';
import { getTextFileContent } from './queries.utils';

export default async function getFileContent(args: TokenizedFileInput) {
  try {
    const rawTextContent = await getTextFileContent(args);
    const parsedData: RowData[] = [];

    await new Promise((resolve) => {
      Papa.parse<string[]>(rawTextContent, {
        worker: true,
        step: (row: any) => {
          const dt: RowData = { data: row.data, id: parsedData.length };
          parsedData.push(dt);
        },
        complete: async () => {
          resolve(null);
        },
      });
    });

    return parsedData;
  } catch (e) {
    throw e;
  }
}
