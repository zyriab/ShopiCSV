import React from 'react';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';
import SvgIcon from '@mui/material/SvgIcon';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ExternalSmallMinor } from '@shopify/polaris-icons';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@mui/material';

interface MtNavItemsProps {
  items: {
    text: string;
    path: string;
    icon: JSX.Element;
    external?: boolean;
  }[];
  selectedItem?: number;
  setSelectedItem?: (n: number) => void;
}

export default function MtNavItems(props: MtNavItemsProps) {
  const navigate = useNavigate();
  const { isDesktop } = useDetectScreenSize();

  function handleClick(n: number, path: string, external?: boolean) {
    props.setSelectedItem?.(n);
    external ? window.open(path, '_blank') : navigate(path);
  }

  return (
    <>
      {props.items.map((itm, index) => (
        <ListItem key={itm.path}>
          <ListItemButton
            selected={props.selectedItem === index}
            onClick={() => handleClick(index, itm.path, itm.external)}>
            <ListItemIcon>
              <SvgIcon
                fontSize={isDesktop ? 'small' : 'large'}
                color={props.selectedItem === index ? 'primary' : 'secondary'}>
                {itm.icon}
              </SvgIcon>
            </ListItemIcon>
            <ListItemText>
              <Stack direction="row" alignItems="center">
                {itm.text}{' '}
                {itm.external && (
                  <SvgIcon fontSize={isDesktop ? 'small' : 'large'}>
                    <ExternalSmallMinor />
                  </SvgIcon>
                )}
              </Stack>
            </ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
}
