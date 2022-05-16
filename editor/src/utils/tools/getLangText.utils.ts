import i18next from 'i18next';
import enFlagSvg from '../../utils/flags/en';
import frFlagSvg from '../../utils/flags/fr';

export default function getLangText(lang?: string) {
  const currentLang = lang || i18next.resolvedLanguage;
  let text = '';
  let flag: any;

  switch (currentLang) {
    case 'fr':
      text = `${i18next.t('Language.french')} ${
        i18next.resolvedLanguage !== 'fr' ? '(français)' : ''
      }`;
      flag = frFlagSvg;
      break;
    default:
      text = `${i18next.t('Language.english')} ${
        i18next.resolvedLanguage !== 'en' ? '(English)' : ''
      }`;
      flag = enFlagSvg;
      break;
  }

  return {
    flag,
    text,
  };
}
