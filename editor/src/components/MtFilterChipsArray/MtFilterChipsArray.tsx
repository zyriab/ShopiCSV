import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';
import { Badge, Tag, Scrollable, Stack } from '@shopify/polaris';
import { FilterMajor } from '@shopify/polaris-icons';
import { FilterType } from '../../definitions/custom';

interface MtFilterChipsArrayProps {
  data: FilterType[];
  onSelected: (anchorEl: any) => void;
  onDelete: (deleted: FilterType[]) => void;
}

export default function MtFilterChipsArray(props: MtFilterChipsArrayProps) {
  const [chipData, setChipData] = React.useState<FilterType[]>([]);

  const refEl = useRef<HTMLDivElement>(null);
  const isDeleting = useRef(false);

  const { t } = useTranslation();
  const { isDesktop } = useDetectScreenSize();

  function handleClick() {
    if (!isDeleting.current) {
      props.onSelected(refEl.current);
    }
    isDeleting.current = false;
  }

  const handleDelete = (chipToDelete: FilterType) => () => {
    isDeleting.current = true;
    const newData = chipData.filter((e) => e.type !== chipToDelete.type);
    setChipData(newData);
    props.onDelete(newData);
  };

  useEffect(() => {
    setChipData([]);

    for (const c of props.data) {
      setChipData((current) => [...new Set([...current, c])]);
    }
  }, [props.data]);

  return (
    <div
      ref={refEl}
      onClick={handleClick}
      style={{
        display: 'flex',
        justifyContent: 'center',
        listStyle: 'none',
        padding: 3,
        marginTop: 0,
        marginBottom: 0,
        backgroundColor: 'var(--p-background)',
        borderRadius: '4px',
        width: isDesktop ? '350px' : '200px',
      }}>
      <Scrollable horizontal>
        <Stack wrap={false} spacing="extraTight">
          {chipData.length > 0 ? (
            chipData.map((data) => {
              return (
                <div key={data.type} style={{ margin: '0.2rem' }}>
                  <Tag onRemove={handleDelete(data)}>{data.type}</Tag>
                </div>
              );
            })
          ) : (
            <Stack distribution="center">
              <div style={{ margin: '0.2rem' }}>
                <Badge icon={FilterMajor} size="small">
                  {t('EmptyFilterChip.label')}
                </Badge>
              </div>
            </Stack>
          )}
        </Stack>
      </Scrollable>
    </div>
  );
}
