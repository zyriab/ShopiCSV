import i18next from 'i18next';
import { enUS, fr } from 'date-fns/locale';

export function getDateLocale() {
    switch (i18next.resolvedLanguage) {
        case 'en-US':
            return enUS;
        case 'fr':
            return fr;
        default:
            return enUS;
    }
}
