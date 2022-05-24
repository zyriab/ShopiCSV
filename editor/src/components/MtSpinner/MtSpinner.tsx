import React from 'react';
import { Spinner } from '@shopify/polaris';

import './MtSpinner.css';

export function MtSpinner() {
  return (
    <div className="MtSpinner__Wrapper">
      <Spinner accessibilityLabel="Editor loading spinner" />
    </div>
  );
}
