import checkFetch from '../../checkFetch.utils';
import { getTextFileContentQuery } from '../../../helpers/gqlQueries.helper';
import { TokenizedFileInput } from '../../../../definitions/custom';

export default async function getTextFileContent(args: TokenizedFileInput) {
  try {
    const query = { ...getTextFileContentQuery };
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
    const typename = resData.data.getTextFileContent.__typename;

    if (typename === 'TextFileContent') {
      return resData.data.getTextFileContent.content as string;
    }

    throw new Error('resData.data.getTextFileContent.message');
  } catch (e) {
    throw e;
  }
}
