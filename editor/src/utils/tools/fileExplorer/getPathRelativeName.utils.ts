import formatPath from './formatPath.utils';

/**
 * Removes the path from the name and formats it in order to be usable by the file explorer.
 * @param {string} fileName i.e.: "folder 1/sub-folder/file.txt"
 * @param {string[]} currentPath i.e.: ['folder 1']
 */
export default function getPathRelativeName(
  fileName: string,
  currentPath: string[]
) {
  return formatPath(
    formatPath(fileName).replace(formatPath(currentPath.join('/')), '')
  ).split('/')[0];
}
