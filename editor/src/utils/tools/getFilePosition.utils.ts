/**
 * Returns the index of a row in the file data array
 * based on the current page, maximum number of fields displayed and row number on the page.
 * @export
 * @param {number} selectedPage
 * @param {number} maxElementsPerPage
 * @param {number} rowNumber
 * @example
 * const selectedPage = 2;
 * const maxElementsPerPage = 5;
 *
 * for(let i = 0; i < maxElementsPerPage; i++)
 *  const index = getFilePosition(selectedPage, maxElementsPerPage, i); // 0 | 1 | 2 | 3 | 4
 */
export default function getFilePosition(
  selectedPage: number,
  maxElementsPerPage: number,
  rowNumber: number
) {
  return Math.round(
    selectedPage * maxElementsPerPage - (maxElementsPerPage - (rowNumber + 1))
  );
}
