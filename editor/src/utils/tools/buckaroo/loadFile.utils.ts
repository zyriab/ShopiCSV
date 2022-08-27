import Papa, {ParseResult} from 'papaparse';
import getDataType from '../getDataType.utils';
import checkFetch from '../checkFetch.utils';
import { getDownloadUrl } from './queries.utils';

interface LoadFileArgs {
  token: string;
  fileName: string;
  path: string;
  root?: string;
  versionId?: string;
  bucketName?: string;
}

export default async function loadFile(args: LoadFileArgs) {
  try {
    const url = await getDownloadUrl(args);

    console.log(url)

    Papa.parse(url, {
      download: true,

      // FIXME: doesn't work, need to check on the possible options of Papaparse
      complete: (r: ParseResult<Record<string, string>>) => {
        console.log(r);
      },
    });
    // DL file
    // parse
    // return RowData[]
  } catch (e) {
    throw e;
  }
}
