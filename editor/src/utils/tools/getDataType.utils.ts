import { DataType } from '../../definitions/custom';

export default function getDataType(): DataType {
  switch (window.location.pathname) {
    case '/translations':
      return 'Translations';
    default:
      return 'Products';
  }
}
