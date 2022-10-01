import getFileExtension from './getFileExtension.utils';

export default function isDirectory(key: string) {
  return getFileExtension(key.split('/').at(-1)!) === '';
}
