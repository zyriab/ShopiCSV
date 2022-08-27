import checkFetch from '../../checkFetch.utils';
import { getDownloadUrlQuery } from '../../../helpers/gqlQueries.helper';
import { TokenizedFileInput } from '../../../../definitions/custom';

export default async function getDownloadUrl(args: TokenizedFileInput) {
  try {
    const query = { ...getDownloadUrlQuery };
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
    const typename = resData.data.getDownloadUrl.__typename;

    if (typename === 'SignedUrl') {
      return resData.data.getDownloadUrl.url as string;
    }

    throw new Error(resData.data.getDownloadUrl.message);
  } catch (e) {
    throw e;
  }
}
