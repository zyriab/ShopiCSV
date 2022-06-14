import store from 'store2';
import { RowData } from '../../../definitions/custom';

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
    savedAt: new Date().toLocaleString(),
  });
}
