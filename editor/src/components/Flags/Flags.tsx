import React from 'react';
import { Icon } from '@shopify/polaris';
import enFlagSvg from '../../utils/flags/en';
import frFlagSvg from '../../utils/flags/fr';

export function flagEN() {
  return <Icon source={enFlagSvg} />;
}
export function flagFR() {
  return <Icon source={frFlagSvg} />;
}
