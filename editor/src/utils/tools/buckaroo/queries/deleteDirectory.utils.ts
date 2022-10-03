import checkFetch from '../../checkFetch.utils';
import { deleteDirectoryQuery } from '../../../helpers/gqlQueries.helper';
import { Directory } from '../../../../definitions/graphql';

interface DeleteDirectoryArgs {
  token: string;
  path: string;
  root?: string;
  bucketName?: string;
}

export default async function deleteDirectory(args: DeleteDirectoryArgs) {
  try {
    const query = { ...deleteDirectoryQuery };
    query.variables.path = args.path;
    query.variables.root = args.root;
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
    const typename = resData.data.deleteDirectory.__typename;

    if (typename === 'Directory') {
      return resData.data.deleteDirectory as Directory | undefined;
    }

    throw new Error(resData.data.deleteDirectory.message);
  } catch (e) {
    throw e;
  }
}
