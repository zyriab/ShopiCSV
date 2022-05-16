import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterType } from '../../definitions/custom';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Badge } from '@shopify/polaris';
import { FilterMajor } from '@shopify/polaris-icons';

interface AppProps {
  data: FilterType[];
  onSelected: (anchorEl: any) => void;
  onDelete: (deleted: FilterType[]) => void;
}

const ChipsContainer = styled('ul')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  listStyle: 'none',
  padding: 3,
  marginTop: 0,
  marginBottom: 0,
  marginRight: theme.spacing(40),
  marginLeft: 0,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '4px',
  [theme.breakpoints.up('md')]: {
    marginLeft: theme.spacing(3),
    width: '32.6vw',
  },
}));

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export function MtFilterChipsArray(props: AppProps) {
  const [chipData, setChipData] = React.useState<FilterType[]>([]);
  const refEl = useRef<HTMLUListElement>(null);
  const { t } = useTranslation();

  function handleClick() {
    props.onSelected(refEl.current);
  }

  const handleDelete = (chipToDelete: FilterType) => () => {
    const newData = chipData.filter((e) => e.type !== chipToDelete.type);
    setChipData(newData);
    props.onDelete(newData);
  };

  useEffect(() => {
    for (const c of props.data)
      setChipData((current) => [...new Set([...current, c])]);
  }, [props.data]);

  return (
    <ChipsContainer ref={refEl} onClick={handleClick}>
      {chipData.length > 0 ? (
        chipData.map((data) => {
          return (
            <ListItem key={data.type}>
              <Chip
                label={data.type}
                size="small"
                onDelete={handleDelete(data)}
              />
            </ListItem>
          );
        })
      ) : (
        <ListItem>
          <Badge icon={FilterMajor} size="small">
            {t('EmptyFilterChip.label')}
          </Badge>
        </ListItem>
      )}
    </ChipsContainer>
  );
}
