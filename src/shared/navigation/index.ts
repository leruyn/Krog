import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '@app/navigation/AppNavigator';

/**
 * Typed navigation hook for the root stack.
 * Provides type-safe navigation.navigate() and navigation.goBack().
 */
export function useAppNavigation() {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}
