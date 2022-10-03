import Papa from 'papaparse';
import { RowData } from '../../../definitions/custom';

export default function rowDataToString(args: RowData[]) {
  try {
    const parsedData = args.map((e) => e.data);
    const str = Papa.unparse(parsedData);

    return str;
  } catch (e) {
    throw e;
  }
}
