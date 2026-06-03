import React, {PropsWithChildren, useMemo} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {store} from '@app/store/store';
import {apiClient} from '@core/api/client';
import {authActions} from '@features/auth/store/authSlice';
import {ThemeProvider, useTheme} from '@core/theme/themeProvider';
import {AuthBootstrap} from '@features/auth/components/AuthBootstrap';
import {saveTokens, clearTokens} from '@features/auth/services/tokenStorage';

// Wire up ApiClient auth callbacks to Redux store
apiClient.configureAuth({
  onTokensRefreshed: ({accessToken, refreshToken}) => {
    store.dispatch(authActions.setAccessToken(accessToken));
    store.dispatch(authActions.setRefreshToken(refreshToken));
    void saveTokens({accessToken, refreshToken});
  },
  onSessionExpired: () => {
    store.dispatch(authActions.logout());
    void clearTokens();
  },
});

function ThemedStatusBar() {
  const {theme} = useTheme();
  return (
    <StatusBar
      animated
      barStyle={theme.isDark ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.background}
    />
  );
}

export function AppProviders({children}: PropsWithChildren) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    [],
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              {/* Bootstrap components run side-effects on mount, render null */}
              <AuthBootstrap />
              {/* [FEATURE]: add more Bootstrap components here */}
              <ThemedStatusBar />
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
