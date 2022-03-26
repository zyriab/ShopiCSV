import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';

const languages = {
  en: { nativeName: 'en-US' },
  fr: { nativeName: 'fr-FR' },
};

export function MtLanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div>
      <button
        style={{
          fontWeight:
            i18n.resolvedLanguage === languages.en.nativeName
              ? 'bold'
              : 'normal',
        }}
        type="submit"
        onClick={() => i18n.changeLanguage(languages.en.nativeName)}>
        {languages.en.nativeName}
      </button>
      <button
        style={{
          fontWeight:
            i18n.resolvedLanguage === languages.fr.nativeName
              ? 'bold'
              : 'normal',
        }}
        type="submit"
        onClick={() => i18n.changeLanguage(languages.fr.nativeName)}>
        {languages.fr.nativeName}
      </button>
    </div>
  );
}
