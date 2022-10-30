import { DataType } from '../../definitions/custom';

export default function getFieldWidth(
  dataType: DataType,
  display: number[],
  numOfColumns: number,
  fieldPosition: number
) {
  if (dataType === 'Translations') {
    const isTranslationField =
      fieldPosition === numOfColumns - 2 || fieldPosition === numOfColumns - 1;

    // code editor does not resize well with xs={true} (Material UI Grid component)
    // also fields containing translations are always larger to make the user's work easier :)
    if (!isTranslationField) {
      return true;
    }

    if (
      (!display.includes(numOfColumns - 2) &&
        display.includes(numOfColumns - 1)) ||
      (display.includes(numOfColumns - 2) &&
        !display.includes(numOfColumns - 1))
    ) {
      // if 'default content' OR 'translated content' is present, other fields' width = 1.
      // here we substract the number of displayed fields from the number of columns (7)
      // -1 is because [def./trans.] is not of size 1 and we want to make this calculation
      // based on the OTHER fields, thus removing [def./trans.] from the substraction ;)
      // i.e.: 3 fields = 2 [others] and 1 [def./trans.] =  7 [cols] - (3 [fields] - 1 [def./trans.])
      // = size of 5 [for def./trans.] + 2 [others] = 7 columns taken 🤓)
      return numOfColumns - (display.length - 1);
    }

    // if 'default content' AND 'translated content' are present, other fields' width = 1.
    // therefore 'def.' and 'trans.' === (numOfColumns / props.display.length - (1 [other]))
    // i.e.: (even) 4 fields = 2 others and 2 [def + trans] -> (7 [cols] - 2 [others]) = 5 / 2 [def + trans]
    // or: (odd) 3 fields = 1 other and 2 [def + trans] -> 8 [cols] / 3 = 2.66
    // CEIL(2.66) = 3 -> + 0.5 -> * 2 [def. + trans.] = 7 + 1 [other] = 8
    // if numOfColumns = 7 -> 7 cols / 3 = 2.33 -> CEIL(2.33) = 3 * 2 [def. + trans] = 6 + 1 [other] = 7
    if (display.length % 2 === 0) {
      return (numOfColumns - (display.length - 2)) / 2;
    }

    return (
      Math.ceil(numOfColumns / display.length) +
      (numOfColumns % 2 === 0 ? 0.5 : 0)
    );
  }
}
