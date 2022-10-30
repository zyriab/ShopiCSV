import { deleteOneFile, deleteDirectory } from './queries.utils';
import isDirectory from '../fileExplorer/isDirectory.utils';
import { TokenizedFileInput } from '../../../definitions/custom';
import formatPath from '../fileExplorer/formatPath.utils';

export default async function deleteObject(args: TokenizedFileInput) {
  try {
    if (isDirectory(args.fileName)) {
      await deleteDirectory({
        ...args,
        path: formatPath(`${args.path}/${args.fileName}`),
      });
      return;
    }

    await deleteOneFile(args);
  } catch (e) {
    throw e;
  }
}
