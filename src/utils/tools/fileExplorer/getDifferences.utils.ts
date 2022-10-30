import { RowData } from '../../../definitions/custom';

/**
 * Compares two translations CSV's translated fields and returns the ones that differ from each other
 * @return Array of `[oldContentStr, currentContentStr]`
 */
export default function getDifferences(
  oldContent: RowData[],
  currentContent: RowData[]
): [RowData[], RowData[]] {
  const length = Math.max(oldContent.length, currentContent.length);

  const tmpOld = [];
  const tmpCurrent = [];

  for (let i = 0; i < length; i++) {
    const data1 = {
      id: oldContent[i]?.id,
      data: oldContent[i]?.data,
    };
    const data2 = {
      id: currentContent[i]?.id,
      data: currentContent[i]?.data,
    };

    if (data1.data.at(-1) !== data2.data.at(-1)) {
      tmpOld.push(data1);
      tmpCurrent.push(data2);
    }
  }

  return [tmpOld, tmpCurrent];
}
