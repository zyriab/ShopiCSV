import React from 'react';
// import { withAuthenticationRequired } from '@auth0/auth0-react';

interface ProtectedRouteProps {
  component: React.ComponentType<object>;
  other?: any[];
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  // const Component = withAuthenticationRequired(props.component);
  // return <Component {...props.other} />;

  return <props.component {...props.other} />;
}
