import checkFetch from '../../checkFetch.utils';
import { getUploadUrlQuery } from '../../../helpers/gqlQueries.helper';
import { SignedPost } from '../../../../definitions/graphql';

interface getUploadUrlArgs {
  token: string;
  fileName: string;
  path: string;
  root?: string;
}

export default async function getUploadUrl(args: getUploadUrlArgs) {
  try {
    const query = { ...getUploadUrlQuery };
    query.variables.fileName = args.fileName;
    query.variables.path = args.path;
    query.variables.root = args.root;

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
    const typename = resData.data.getUploadUrl.__typename;

    if (typename === 'SignedPost') {
      return resData.data.getUploadUrl as SignedPost;
    }

    throw new Error(resData.data.getUploadUrl.message);
  } catch (e) {
    throw e;
  }
}
