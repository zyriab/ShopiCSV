import checkFetch from '../../checkFetch.utils';
import { deleteOneFileQuery } from '../../../helpers/gqlQueries.helper';
import { TokenizedFileInput } from '../../../../definitions/custom';

export default async function deleteOneFile(args: TokenizedFileInput) {
  try {
    const query = { ...deleteOneFileQuery };
    query.variables.fileName = args.fileName;
    query.variables.path = args.path;
    query.variables.root = args.root;
    query.variables.versionId = args.versionId;
    query.variables.bucketName = args.bucketName;

    const res = await window.fetch(process.env.REACT_APP_BUCKAROO_URL!, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${args.token} ${process.env.REACT_APP_TENANT}`,
      },
    });

    checkFetch(res);

    const resData = await res.json();
    const typename = resData.data.deleteOneFile.__typename;

    if (typename === 'FileName') {
      return resData.data.deleteOneFile.name as string | undefined;
    }

    throw new Error(resData.data.deleteOneFile.message);
  } catch (e) {
    throw e;
  }
}
