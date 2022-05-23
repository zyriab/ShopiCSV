import React from 'react';
import { Spinner } from '@shopify/polaris';

export function MtSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
      }}>
      <Spinner accessibilityLabel="Editor loading spinner" />
    </div>
  );
}
