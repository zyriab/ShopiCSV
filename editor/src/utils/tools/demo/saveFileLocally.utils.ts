import store from 'store2';
import { RowData } from '../../../definitions/custom';
import formatPath from '../fileExplorer/formatPath.utils';

interface inputArgs {
  content: RowData[];
  name: string;
  size: number;
  lastModified: number;
}

export default function saveFileLocally(args: inputArgs) {
  store.remove('fileData');
  store.set('fileData', {
    ...args,
    name: args.name.split('/').at(-1),
    savedAt: new Date().toLocaleString(),
  });
}
