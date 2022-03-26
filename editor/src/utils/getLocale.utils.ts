import { enUS, fr } from 'date-fns/locale';

export function getLocale(localeStr: string) {
  switch (localeStr) {
    case 'en-US':
      return enUS;
    case 'fr':
      return fr;
    default:
      return enUS;
  }
}
