import {
  LEGACY_TRANSLATION_HEADER_CONTENT,
  PRODUCTS_HEADER_CONTENT,
  TRANSLATIONS_HEADER_CONTENT,
} from '../../utils/helpers/headerContents.helper';
import { DataType } from '../../definitions/custom';

export default function getExpectedHeaderContent(
  dataType: DataType,
  numOfColumns: number
) {
  if (dataType === 'Translations') {
    if (numOfColumns === 7) {
      return LEGACY_TRANSLATION_HEADER_CONTENT;
    }

    return TRANSLATIONS_HEADER_CONTENT;
  }

  if (dataType === 'Products') {
    return PRODUCTS_HEADER_CONTENT;
  }

  return [];
}
