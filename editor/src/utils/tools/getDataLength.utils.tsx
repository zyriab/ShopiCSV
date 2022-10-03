import { RowData } from '../../definitions/custom';
import getStatusColIndex from './getStatusColIndex.utils';

/**
 * Returns the length of a RowData array, filters 'outdated' status translations if enabled
 * @param {RowData[]} data parsed CSV rows
 * @param {boolean} showOutdated Only show translations marked as "outdated"
 * @return {number} Length of the (filtered or not) data array
 */
export default function getDataLength(
  data: RowData[],
  showOutdated: boolean
): number {
  if (!showOutdated) {
    return data.length;
  }

  const statusColIndex = getStatusColIndex(data[0].data);

  return data.filter((d) => d.data[statusColIndex] === 'outdated').length;
}
