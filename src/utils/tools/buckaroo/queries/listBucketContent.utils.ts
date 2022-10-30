import getDataType from '../../getDataType.utils';
import { listBucketContentQuery } from '../../../helpers/gqlQueries.helper';
import checkFetch from '../../checkFetch.utils';
import { File } from '../../../../definitions/graphql';
import {
  BucketObject,
  BucketObjectVersion,
} from '../../../../definitions/mtFileExplorer';

interface ListBucketContentArgs {
  token: string;
  userName?: string;
  bucketName?: string;
}

export default async function listBucketContent(args: ListBucketContentArgs) {
  try {
    const query = { ...listBucketContentQuery };

    query.variables.path = getDataType();
    query.variables.root = args.userName;
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
    const typename = resData.data.listBucketContent.__typename;

    if (typename === 'ObjectList') {
      const ObjectList: File[] = resData.data.listBucketContent.objects;

      return ObjectList.map((f, i) => ({
        id: f.id || `${i}`,
        name: f.name,
        size: f.size,
        path: f.path,
        content: [],
        lastModified: new Date(f.lastModified),
        versions: f.versions?.map((v) => ({
          id: v.id,
          size: v.size,
          path: v.path,
          content: [],
          lastModified: new Date(v.lastModified),
        })) as BucketObjectVersion[],
      })) as BucketObject[];
    }

    throw new Error(resData.data.listBucketContent.message);
  } catch (e) {
    throw e;
  }
}
