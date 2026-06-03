import React, {useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';

import {useAppDispatch} from '@app/store/hooks';
import {apiClient} from '@core/api/client';
import {useTheme} from '@core/theme';
import {authActions} from '../store/authSlice';
import {saveTokens} from '../services/tokenStorage';
import {Box, Text} from '@shared/components/primitives';
import {Button} from '@shared/components/Button';
import {InputField} from '@shared/components/InputField';

type LoginFormValues = {
  username: string;
  password: string;
};

/**
 * LoginScreen
 *
 * Minimal login form. Customize:
 * 1. Replace the loginApi call with your actual endpoint.
 * 2. Add your logo/branding in the header area.
 */
export function LoginScreen() {
  const {t} = useTranslation('auth');
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const {control, handleSubmit, formState: {errors}} = useForm<LoginFormValues>({
    defaultValues: {username: '', password: ''},
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      // TODO: Replace with your actual login API call
      const response = await apiClient.instance.post('/auth/login', {
        username: values.username,
        password: values.password,
      });

      const {access_token, refresh_token, user_id, role_id} = response.data;

      await saveTokens({
        accessToken: access_token,
        refreshToken: refresh_token,
        userId: user_id,
        roleId: role_id ?? null,
      });

      apiClient.setTokens(access_token, refresh_token);

      dispatch(
        authActions.loginSuccess({
          accessToken: access_token,
          refreshToken: refresh_token,
          userId: user_id,
          roleId: role_id ?? null,
        }),
      );
    } catch {
      Alert.alert('Lỗi', t('login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, {backgroundColor: theme.colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* ── Header ─────────────────────────────── */}
        <Box marginBottom="xxl" alignItems="center">
          {/* TODO: Add your logo here */}
          <Text variant="h2" color="text" textAlign="center">
            Đăng nhập
          </Text>
        </Box>

        {/* ── Form ───────────────────────────────── */}
        <Controller
          name="username"
          control={control}
          rules={{required: 'Vui lòng nhập tên đăng nhập'}}
          render={({field: {onChange, onBlur, value}}) => (
            <InputField
              label={t('username')}
              placeholder={t('username_placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.username?.message}
              autoCapitalize="none"
              keyboardType="default"
              containerStyle={styles.field}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{required: 'Vui lòng nhập mật khẩu'}}
          render={({field: {onChange, onBlur, value}}) => (
            <InputField
              label={t('password')}
              placeholder={t('password_placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry
              containerStyle={styles.field}
            />
          )}
        />

        <Button
          title={t('login')}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          size="lg"
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  field: {marginBottom: 16},
  button: {marginTop: 8},
});
