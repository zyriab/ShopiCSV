import checkFetch from '../../checkFetch.utils';
import { deleteManyFilesQuery } from '../../../helpers/gqlQueries.helper';

interface DeleteManyFilesArgs {
  token: string;
  fileNames: string[];
  path: string;
  root?: string;
  versionIds?: string[];
  bucketName?: string;
}

export default async function deleteManyFiles(args: DeleteManyFilesArgs) {
  try {
    const query = { ...deleteManyFilesQuery };
    query.variables.fileNames = args.fileNames;
    query.variables.path = args.path;
    query.variables.root = args.root;
    query.variables.versionIds = args.versionIds;
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
    const typename = resData.data.deleteManyFiles.__typename;

    if (typename === 'FileNameList') {
      return resData.data.deleteManyFiles.names as string[] | undefined;
    }

    throw new Error(resData.data.deleteManyFiles.message);
  } catch (e) {
    throw e;
  }
}
