import React, { useState } from 'react';
import store from 'store2';
import { useTranslation } from 'react-i18next';
import { Button, OptionList, Popover } from '@shopify/polaris';
import { ViewMinor } from '@shopify/polaris-icons';
import { OptionDescriptor } from '@shopify/polaris/build/ts/latest/src/types';

interface MtColumnSelectorProps {
  onChange: (selected: number[]) => void;
  choices: string[];
}

export default function MtColumnSelector(props: MtColumnSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(
    store.get('columns')?.length > 0 ? JSON.parse(
      store.get('columns')).map((c: number) => c.toString())
      : props.choices.map(c => props.choices.indexOf(c).toString())
  );

  const { t } = useTranslation();

  function handleSelection(selection: string[]) {
    const select = selection.length > 0 ? selection : props.choices.map(c => props.choices.indexOf(c).toString());
    const tmp = select.map((s) => +s);

    setSelected(select);
    props.onChange(tmp);
  }

  function handleTogglePopover() {
    setOpen((current) => !current);
  }

  const activatorBtn = (
    <Button onClick={handleTogglePopover} icon={ViewMinor} disclosure>
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
