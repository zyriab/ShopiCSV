import Papa from 'papaparse';
import getDataType from '../getDataType.utils';
import { GetUploadUrlQuery } from '../../helpers/gqlQueries.helper';
import { RowData } from '../../../definitions/custom';

interface SaveFileArgs {
  file: RowData[];
  fileName: string;
  token: string;
}

interface PreSignedPost {
  url: string;
  fields: { [key: string]: string };
}

export default async function SaveFile(args: SaveFileArgs) {
  try {
    const query = { ...GetUploadUrlQuery };
    // const form = new FormData();
    const file = args.file.map((e) => e.data);
    // const data = Papa.unparse(file);

    query.variables.fileName = args.fileName;
    query.variables.path = getDataType();

    // console.dir(query);

    // FIXME: "TypeError: Failed to fetch"
    const res = await window.fetch(
      'https://44kxybpuheewejuvm3lkqsxw3m0zevhn.lambda-url.eu-central-1.on.aws/',
      {
        method: 'POST',
        body: JSON.stringify({ foo: 'bar' }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${args.token}`,
        },
      }
    );

    // Object.entries(res.body.fields).forEach(([field, value]) =>
    //   form.append(field, value)
    // );
    // form.append('file', data);

    // console.log(process.env.REACT_APP_BUCKAROO_URL);
    console.table(res);
  } catch (e) {
    console.log(e);
  }
}
