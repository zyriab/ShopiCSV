import React from 'react';
import useDetectScreenSize from '../../utils/hooks/useDetectScreenSize';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '../../utils/hooks/useAuth0';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ExternalSmallMinor } from '@shopify/polaris-icons';

interface MtNavItemsProps {
  items: {
    text: string;
    path: string;
    icon: JSX.Element;
    external?: boolean;
    public?: boolean;
    disabled?: boolean;
  }[];
  selectedItem?: number;
  setSelectedItem?: (n: number) => void;
}

export default function MtNavItems(props: MtNavItemsProps) {
  const { isAuthenticated } = useAuth0();
  const { isDesktop } = useDetectScreenSize();
  const navigate = useNavigate();

  function handleClick(n: number, path: string, external?: boolean) {
    props.setSelectedItem?.(n);
    external ? window.open(path, '_blank') : navigate(path);
  }

  return (
    <>
      {props.items.map((itm, index) => (
        <ListItem key={itm.path}>
          <ListItemButton
            disabled={(!itm.public && !isAuthenticated) || itm.disabled}
            selected={props.selectedItem === index}
            onClick={() => handleClick(index, itm.path, itm.external)}>
            <ListItemIcon>
              <SvgIcon
                fontSize={isDesktop ? 'small' : 'medium'}
                color={props.selectedItem === index ? 'primary' : 'secondary'}>
                {itm.icon}
              </SvgIcon>
            </ListItemIcon>
            <ListItemText>
              <Stack direction="row" alignItems="center">
                {itm.text}{' '}
                {itm.external && (
                  <SvgIcon fontSize="small">
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
