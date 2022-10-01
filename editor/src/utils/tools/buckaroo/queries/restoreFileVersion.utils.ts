import checkFetch from '../../checkFetch.utils';
import { restoreFileVersionQuery } from '../../../helpers/gqlQueries.helper';
import { TokenizedFileInput } from '../../../../definitions/custom';

export default async function restoreFileVersion(args: TokenizedFileInput) {
  try {
    const query = { ...restoreFileVersionQuery };
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
    const typename = resData.data.restoreFileVersion.__typename;

    if (typename === 'VersionId') {
      return resData.data.restoreFileVersion.id as string | undefined;
    }

    throw new Error(resData.data.restoreFileVersion.message);
  } catch (e) {
    throw e;
  }
}
