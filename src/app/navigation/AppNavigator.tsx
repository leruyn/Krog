import React from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useTheme} from '@core/theme';
import {useAppSelector} from '@app/store/hooks';
import {LoginScreen} from '@features/auth/screens/LoginScreen';

/**
 * Root Stack Param List
 *
 * Add new screens here as the project grows.
 * Pattern: { ScreenName: RouteParams | undefined }
 */
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  // [FEATURE]: add more screens here
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const {theme} = useTheme();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const isHydrated = useAppSelector((state) => state.auth.isHydrated);

  // Don't render until store is hydrated from storage
  if (!isHydrated) {
    return null;
  }

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {accessToken ? (
          <>
            {/* Authenticated screens */}
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            {/* [FEATURE]: add authenticated screens here */}
          </>
        ) : (
          <>
            {/* Unauthenticated screens */}
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
