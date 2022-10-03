/**
 * Returns the index of the "Status" columns in the first row of a parsed translation CSV file (RowData)
 * @param {string[]} row First row of a parsed translation CSV file
 * @return {number} index or -1 if the column is not present
 */
export default function getStatusColIndex(row: string[]): number {
  return row.findIndex((c) => c === 'Status');
}
