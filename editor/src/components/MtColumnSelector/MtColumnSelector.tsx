import React, { useState } from 'react';
import store from 'store2';
import { useTranslation } from 'react-i18next';
import { Button, OptionList, Popover } from '@shopify/polaris';
import { OptionDescriptor } from '@shopify/polaris/build/ts/latest/src/types';

interface MtColumnSelectorProps {
  onChange: (selected: number[]) => void;
  choices: string[];
}

export default function MtColumnSelector(props: MtColumnSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    JSON.parse(store.get('columns')).map((c: number) => c.toString())
  );

  const { t } = useTranslation();

  function handleSelection(selection: string[]) {
    const tmp = selection.map((s) => +s);
    setSelected(selection);
    props.onChange(tmp);
  }

  function handleTogglePopover() {
    setOpen((current) => !current);
  }

  const activatorBtn = (
    <Button onClick={handleTogglePopover} disclosure>
      {t('ColumnSelector.label')}
    </Button>
  );

  return (
    <Popover
      sectioned
      active={open}
      activator={activatorBtn}
      onClose={handleTogglePopover}
      ariaHaspopup={false}>
      <Popover.Pane height="200px">
        <OptionList
          title={t('ColumnSelector.title')}
          onChange={handleSelection}
          selected={selected}
          options={
            props.choices.map((c, i) => ({
              value: i.toString(),
              label: c,
            })) as OptionDescriptor[]
          }
          allowMultiple
        />
      </Popover.Pane>
    </Popover>
  );
}
