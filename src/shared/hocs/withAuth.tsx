import React from 'react';
import {useAppSelector} from '@app/store/hooks';

/**
 * withAuth HOC
 *
 * Wraps a component and only renders it if the user has a valid accessToken.
 * Returns null otherwise (navigation will redirect to Login via AppNavigator).
 *
 * Usage:
 *   export default withAuth(MyProtectedComponent);
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P> {
  const WithAuth = (props: P) => {
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    if (!accessToken) return null;
    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return WithAuth;
}
