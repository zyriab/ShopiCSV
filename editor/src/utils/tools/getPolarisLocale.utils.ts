import i18next from 'i18next';
import fr from '@shopify/polaris/locales/fr.json';
import en from '@shopify/polaris/locales/en.json';

export function getPolarisLocale() {
    switch (i18next.resolvedLanguage) {
        case 'fr':
            return fr;
        default:
            return en;
    }
}
