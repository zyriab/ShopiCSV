import Papa from 'papaparse';
import getDataType from '../getDataType.utils';
import { GetUploadUrlQuery } from '../../helpers/gqlQueries.helper';
import { RowData } from '../../../definitions/custom';
import checkFetch from '../checkFetch.utils';

interface SaveFileArgs {
  file: RowData[];
  fileName: string;
  token: string;
}

export default async function SaveFile(args: SaveFileArgs) {
  try {
    const form = new FormData();
    const file = args.file.map((e) => e.data);
    const data = Papa.unparse(file);
    const query = { ...GetUploadUrlQuery };

    query.variables.fileName = args.fileName;
    query.variables.path = getDataType();

    // Fetching AWS signed POST from Buckaroo
    const res = await window.fetch(process.env.REACT_APP_BUCKAROO_URL!, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        // Passing the encrypted tenant to call the proper Auth0 API
        Authorization: `Bearer ${args.token} ${process.env.REACT_APP_TENANT}`,
      },
    });

    checkFetch(res);

    const resData = await res.json();
    const typename = resData.data.getUploadUrl.__typename;

    if (typename === 'SignedPost') {
      const url: string = resData.data.getUploadUrl.url;
      const fields: Object = resData.data.getUploadUrl.fields;

      Object.entries(fields).forEach(([field, value]: [string, string]) =>
        form.append(field, value)
      );
      form.append('file', data);

      // Uploading file to bucket
      const upRes = await window.fetch(url, {
        method: 'POST',
        body: form,
      });

      checkFetch(upRes);
    } else {
      throw new Error(resData.data.message);
    }
  } catch (e) {
    throw e;
  }
}
