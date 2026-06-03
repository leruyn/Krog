import React from 'react';
import {useAppDispatch} from '@app/store/hooks';
import {authActions} from '../store/authSlice';
import {apiClient} from '@core/api/client';
import {getTokens} from '../services/tokenStorage';

let LocalAuthentication: any = null;
try {
  LocalAuthentication = require('expo-local-authentication');
} catch {
  // Graceful fallback if native module not linked
}

/**
 * AuthBootstrap
 *
 * Runs once on app mount. Reads tokens from secure storage and hydrates
 * the Redux auth state. Handles biometric re-authentication if enabled.
 *
 * Renders null — purely a side-effect component.
 */
export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const attempted = React.useRef(false);

  React.useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    void (async () => {
      try {
        const tokens = await getTokens();

        if (!tokens) {
          dispatch(authActions.setHydrated(true));
          return;
        }

        // Biometric authentication gate
        if (tokens.biometricEnabled && LocalAuthentication) {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();

          if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Xác thực để tiếp tục',
              fallbackLabel: 'Nhập mật khẩu',
            });

            if (!result.success) {
              // User cancelled → require manual login
              dispatch(authActions.setHydrated(true));
              return;
            }
          }
        }

        // Restore session
        dispatch(
          authActions.hydrate({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            userId: tokens.userId,
            roleId: tokens.roleId,
            biometricEnabled: tokens.biometricEnabled,
          }),
        );
        apiClient.setTokens(tokens.accessToken, tokens.refreshToken);
      } catch {
        // Any error → mark hydrated so the app can proceed to Login
        dispatch(authActions.setHydrated(true));
      }
    })();
  }, [dispatch]);

  return null;
}
