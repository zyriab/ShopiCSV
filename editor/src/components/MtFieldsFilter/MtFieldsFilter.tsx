import React, { useState, useEffect } from 'react';
import {
  FilterType,
  TranslatableResourceType,
} from '../../definitions/definitions';
import { MtFilterChipsArray } from '../MtChipsArray/MtChipsArray';
import { MtFilterDialog } from '../MtFilterDialog/MtFilterDialog';

interface AppProps {
  availableFilters: TranslatableResourceType[];
  filteredDataTypes: (t: TranslatableResourceType[]) => void;
}

export function MtFieldsFilter(props: AppProps) {
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  function handleClick(el: any) {
    setAnchorEl(el);
  }

  function handleClose(selection: FilterType[]) {
    setSelectedFilters(selection);
    setAnchorEl(null);
  }

  useEffect(() => {
    const tmp = filtersData.filter((e) =>
      props.availableFilters.includes(e.type)
    );
    setFilters([...new Set(tmp)]);
  }, [props.availableFilters]);

  useEffect(() => {
    if (selectedFilters.length > 0)
      props.filteredDataTypes(selectedFilters.map((e) => e.type));
    else props.filteredDataTypes([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, props.filteredDataTypes]);

  return (
    <>
      <MtFilterChipsArray
        data={selectedFilters}
        onSelected={handleClick}
        onDelete={(val) => setSelectedFilters(val)}
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

// TODO: i18n
const filtersData: FilterType[] = [
  {
    type: 'COLLECTION',
    description: 'A product collection.',
  },
  {
    type: 'DELIVERY_METHOD_DEFINITION',
    description:
      'The delivery method definition. For example, "Standard", or "Expedited".',
  },
  {
    type: 'EMAIL_TEMPLATE',
    description: 'An email template.',
  },
  {
    type: 'SMS_TEMPLATE',
    description: 'An SMS template.',
  },
  {
    type: 'LINK',
    description: 'A link to direct users.',
  },
  {
    type: 'METAFIELD',
    description: 'A Metafield.',
  },
  {
    type: 'ONLINE_STORE_ARTICLE',
    description: 'An online store article.',
  },
  {
    type: 'ONLINE_STORE_BLOG',
    description: 'An online store blog.',
  },
  {
    type: 'ONLINE_STORE_MENU',
    description: 'A category of links.',
  },
  {
    type: 'ONLINE_STORE_PAGE',
    description: 'An online store page.',
  },
  {
    type: 'ONLINE_STORE_THEME',
    description: 'An online store theme.',
  },
  {
    type: 'PACKING_SLIP_TEMPLATE',
    description: 'A packing slip template.',
  },
  {
    type: 'PAYMENT_GATEWAY',
    description: 'A payment gateway.',
  },
  {
    type: 'PRODUCT',
    description: 'An online store product.',
  },
  {
    type: 'PRODUCT_OPTION',
    description:
      'An online store custom product property name. For example, "Size", "Color", or "Material".',
  },
  {
    type: 'PRODUCT_VARIANT',
    description: 'An online store product variant.',
  },
  {
    type: 'SHOP',
    description: 'A shop.',
  },
  {
    type: 'SHOP_POLICY',
    description: 'A shop policy.',
  },
];
