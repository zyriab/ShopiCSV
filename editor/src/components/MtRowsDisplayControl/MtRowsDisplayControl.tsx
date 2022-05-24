import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Button, ButtonGroup, TextStyle } from '@shopify/polaris';

interface AppProps {
  maxRowDisplay: number;
  handleRowsDisplayChange: (n: number) => void;
}

export function MtRowsDisplayControl(props: AppProps) {
  const { t } = useTranslation();

  const BTN_VALUES = [2, 4, 8, 16];

  return (
    <Stack alignment="baseline">
      <TextStyle variation="subdued">
        {t('RowDisplayControl.displayPer')}
      </TextStyle>
      <ButtonGroup>
        {BTN_VALUES.map((v) => (
          <Button
            key={v}
            onClick={() => props.handleRowsDisplayChange(v)}
            outline={props.maxRowDisplay === v}
            plain={props.maxRowDisplay !== v}
            pressed
            monochrome
            removeUnderline
            accessibilityLabel={t('RowDisplayControl.btnA11yLabel', {
              number: v,
            })}>
            {`${v}`}
          </Button>
        ))}
      </ButtonGroup>
    </Stack>
  );
}
