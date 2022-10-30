import { DataType } from '../../definitions/custom';

/**
 * Returns the data type of the current file based on the window's url
 * @return {string}  'Translations' | 'Products'
 */
export default function getDataType(): DataType {
  switch (window.location.pathname) {
    case '/translations':
      return 'Translations';
    default:
      return 'Products';
  }
}
