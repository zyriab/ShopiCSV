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
  const search = useSearch(props.data, 5);
  const { inputValue, resultIds, isLoading, handleChange, handleClear } =
    search;
  const { t } = useTranslation();

  const endAdornment = isLoading ? (
    <Spinner size="small" />
  ) : (
    <TextStyle variation="strong">{props.numOfDisplayedFields}</TextStyle>
  );

  useEffect(() => props.filteredDataIds(resultIds), [props, resultIds]);

  return (
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
        inputValue.length && (
          <Tag>
            <Stack alignment="center">{endAdornment}</Stack>
          </Tag>
        )
      }
    />
  );
}
