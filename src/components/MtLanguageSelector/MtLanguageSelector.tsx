import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, ActionList, Button } from '@shopify/polaris';
import getLangText from '../../utils/tools/getLangText.utils';

export function MtLanguageSelector() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.resolvedLanguage);
  const [show, setShow] = useState(false);

  const language = {
    en: 'en',
    fr: 'fr',
  };

  const options = [
    {
      active: selected === language.en,
      content: getLangText(language.en).text,
      value: language.en,
      icon: getLangText(language.en).flag,
      onAction: () => handleSelect(language.en),
    },
    {
      active: selected === language.fr,
      content: getLangText(language.fr).text,
      value: language.fr,
      icon: getLangText(language.fr).flag,
      onAction: () => handleSelect(language.fr),
    },
  ];

  const selectorEl = (
    <Button icon={getLangText(selected).flag} onClick={toggleShow} disclosure>
      {getLangText(selected).text}
    </Button>
  );

  function toggleShow() {
    setShow((current) => !current);
  }

  function handleSelect(value: string) {
    setSelected(value);
    i18n.changeLanguage(`${value}`);
  }

  useEffect(() => {
    options.sort((a, b) => a.value.localeCompare(b.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Popover active={show} activator={selectorEl} onClose={toggleShow}>
      <ActionList items={options} />
    </Popover>
  );
}
