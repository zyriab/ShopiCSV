import React, { useEffect, useRef } from 'react';
import { FilterType } from '../../definitions/definitions';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import FilterListIcon from '@mui/icons-material/FilterList';

interface AppProps {
  data: FilterType[];
  onSelected: (anchorEl: any) => void;
  onDelete: (deleted: FilterType[]) => void;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export function MtFilterChipsArray(props: AppProps) {
  const [chipData, setChipData] = React.useState<FilterType[]>([]);
  const refEl = useRef<HTMLUListElement>(null!);

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
    <Paper
      ref={refEl}
      onClick={handleClick}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '32.5vw',
        marginLeft: '4%',
        listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul">
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
        // TODO: i18n
        <ListItem>
          <Chip icon={<FilterListIcon />} label="Filter content" size="small" />
        </ListItem>
      )}
    </Paper>
  );
}
