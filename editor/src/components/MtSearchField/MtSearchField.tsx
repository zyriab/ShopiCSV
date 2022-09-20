import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../utils/hooks/useSearch';
import {
  TextField,
  Icon,
  Stack,
  Tag,
  Spinner,
  TextStyle,
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { RowData } from '../../definitions/custom';

interface AppProps {
  data: RowData[];
  filteredDataIds: (n: number[]) => void;
  numOfDisplayedFields: number;
}

export function MtSearchField(props: AppProps) {
  // TODO: add possibility to chose which column to query
  const { inputValue, resultIds, isLoading, handleChange, handleClear } = useSearch(props.data, 6);
  const { t } = useTranslation();

  const endAdornment = isLoading ? (
    <Spinner size="small" />
  ) : (
    <TextStyle variation="strong">{props.numOfDisplayedFields}</TextStyle>
  );

  useEffect(() => props.filteredDataIds(resultIds), [props, resultIds]);

  return (
    <div style={{ width: '400px' }}>
      <TextField
        labelHidden
        label="search field"
        autoComplete="off"
        inputMode="search"
        placeholder={t('General.search')}
        value={inputValue}
        onChange={handleChange}
        onClearButtonClick={handleClear}
        clearButton
        prefix={<Icon source={SearchMinor} />}
        suffix={
          inputValue.length > 0 && (
            <Tag>
              <Stack alignment="center">{endAdornment}</Stack>
            </Tag>
          )
        }
      />
    </div>
  );
}
