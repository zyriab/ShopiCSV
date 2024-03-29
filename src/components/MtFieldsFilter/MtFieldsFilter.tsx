import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterType, TranslatableResourceType } from '../../definitions/custom';
import MtFilterChipsArray from '../MtFilterChipsArray/MtFilterChipsArray';
import MtFilterDialog from '../MtFilterDialog/MtFilterDialog';

interface MtFieldsFilterProps {
  availableFilters: TranslatableResourceType[];
  filteredDataTypes: (t: TranslatableResourceType[]) => void;
  onShowOutdated: (show: boolean) => void;
}

export default function MtFieldsFilter(props: MtFieldsFilterProps) {
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const memoizedData = useMemo(
    () =>
      [
        {
          type: 'COLLECTION',
          description: t('FilterType.COLLECTION'),
        },
        {
          type: 'DELIVERY_METHOD_DEFINITION',
          description: t('FilterType.DELIVERY_METHOD_DEFINITION'),
        },
        {
          type: 'EMAIL_TEMPLATE',
          description: t('FilterType.EMAIL_TEMPLATE'),
        },
        {
          type: 'SMS_TEMPLATE',
          description: t('FilterType.SMS_TEMPLATE'),
        },
        {
          type: 'LINK',
          description: t('FilterType.LINK'),
        },
        {
          type: 'METAFIELD',
          description: t('FilterType.METAFIELD'),
        },
        {
          type: 'ONLINE_STORE_ARTICLE',
          description: t('FilterType.ONLINE_STORE_ARTICLE'),
        },
        {
          type: 'ONLINE_STORE_BLOG',
          description: t('FilterType.ONLINE_STORE_BLOG'),
        },
        {
          type: 'ONLINE_STORE_MENU',
          description: t('FilterType.ONLINE_STORE_MENU'),
        },
        {
          type: 'ONLINE_STORE_PAGE',
          description: t('FilterType.ONLINE_STORE_PAGE'),
        },
        {
          type: 'ONLINE_STORE_THEME',
          description: t('FilterType.ONLINE_STORE_THEME'),
        },
        {
          type: 'PACKING_SLIP_TEMPLATE',
          description: t('FilterType.PACKING_SLIP_TEMPLATE'),
        },
        {
          type: 'PAYMENT_GATEWAY',
          description: t('FilterType.PAYMENT_GATEWAY'),
        },
        {
          type: 'PRODUCT',
          description: t('FilterType.PRODUCT'),
        },
        {
          type: 'PRODUCT_OPTION',
          description: t('FilterType.PRODUCT_OPTION'),
        },
        {
          type: 'PRODUCT_VARIANT',
          description: t('FilterType.PRODUCT_VARIANT'),
        },
        {
          type: 'SHOP',
          description: t('FilterType.SHOP'),
        },
        {
          type: 'SHOP_POLICY',
          description: t('FilterType.SHOP_POLICY'),
        },
      ] as FilterType[],
    [t]
  );

  function handleClick(el: any) {
    setAnchorEl(el);
  }

  function handleClose(selection: FilterType[], showOutdated: boolean) {
    setSelectedFilters(selection);
    props.onShowOutdated(showOutdated);
    setAnchorEl(null);
  }

  useEffect(() => {
    const filtersData = [
      ...new Set(
        memoizedData.filter((e) => props.availableFilters.includes(e.type))
      ),
    ];

    setFilters(filtersData);
    setSelectedFilters(filtersData);
  }, [memoizedData, props.availableFilters]);

  useEffect(() => {
    if (selectedFilters.length > 0) {
      props.filteredDataTypes(selectedFilters.map((e) => e.type));
      return;
    }

    props.filteredDataTypes([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, props.filteredDataTypes]);

  return (
    <>
      <MtFilterChipsArray
        data={selectedFilters.length === filters.length ? [] : selectedFilters}
        onSelected={handleClick}
        onDelete={setSelectedFilters}
      />
      <MtFilterDialog
        anchorEl={anchorEl}
        filters={filters}
        selected={selectedFilters}
        onClose={handleClose}
      />
    </>
  );
}
