import hasHTMLInRow from './hasHTMLInRow.utils';
import hasCSSInRow from './hasCSSInRow.utils';

export default function getEditorLanguage(row: string[]) {
  if (hasHTMLInRow(row)) return 'liquid';
  if (hasCSSInRow(row)) return 'css';
  return 'none';
}
