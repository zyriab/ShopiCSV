import { DataType } from '../../definitions/custom';

export default function getFieldWidth(
  dataType: DataType,
  display: number[],
  numOfRows: number
) {
  if (dataType === 'Translations') {
    if (
      !display.includes(numOfRows - 2) &&
      !display.includes(numOfRows - 1)
    ) {
      return true;
    }
    return 1;
  }
}
