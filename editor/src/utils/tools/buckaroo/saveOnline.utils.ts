import getDataType from '../getDataType.utils';
import checkFetch from '../checkFetch.utils';
import { getUploadUrl } from './queries.utils';

interface SaveOnlineArgs {
  data: string;
  fileName: string;
  token: string;
}

export default async function saveOnline(args: SaveOnlineArgs) {
  try {
    const form = new FormData();
    const signedPost = await getUploadUrl({
      token: args.token,
      fileName: args.fileName,
      path: getDataType(),
    });

    const url = signedPost.url;
    const fields: Object = signedPost.fields;

    Object.entries(fields).forEach(([field, value]: [string, string]) =>
      form.append(field, value)
    );
    form.append('file', args.data);

    // Uploading file to bucket
    const upRes = await window.fetch(url, {
      method: 'POST',
      body: form,
    });

    checkFetch(upRes);
  } catch (e) {
    throw e;
  }
}
