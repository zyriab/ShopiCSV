import normalize from 'normalize-path';

/**
 * Cleans up given path, removing redundant '/' and more
 * @param {string} path 'examplary/path/to/file/'
 * @param {*} [{ stripTrailing = true, stripLeading = true }] - stripLeading removes '/' at the beginning -- stripTrailing removes '/' at the end
 * @return {string} formatted path
 */
export default function formatPath(
  path: string,
  { stripTrailing = true, stripLeading = true } = {}
) {
  const str: string | string[] = Array.from(path);

  if (stripLeading) {
    while (str[0] === '/') {
      str.shift();
    }
  }
  return normalize(str.join(''), stripTrailing);
}
