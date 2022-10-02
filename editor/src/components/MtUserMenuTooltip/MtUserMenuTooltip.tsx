import React from 'react';
import { Tooltip } from '@shopify/polaris';

interface MtUserMenuTooltipProps {
  name: string;
  email: string;
  isUserMenuOpen: boolean;
  children: React.ReactNode;
}
export function MtUserMenuTooltip(props: MtUserMenuTooltipProps) {
  return props.isUserMenuOpen ? (
    <>{props.children}</>
  ) : (
    <Tooltip
      dismissOnMouseOut
      content={
        <div>
          {props.name}
          <br />
          <small>{props.email}</small>
        </div>
      }>
      {props.children}
    </Tooltip>
  );
}
