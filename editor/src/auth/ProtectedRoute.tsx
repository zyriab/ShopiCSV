import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

interface AppProps {
  component: React.ComponentType<object>,
  other?: any[]
}

export function ProtectedRoute(props: AppProps) {
  const Component = withAuthenticationRequired(props.component);
  return <Component {...props.other} />;
}
