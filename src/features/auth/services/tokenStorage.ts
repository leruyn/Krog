import * as Keychain from 'react-native-keychain';

/**
 * Storage keys — thay prefix khi dùng cho project mới.
 * VD: '@MyApp/auth/tokens'
 */
const SERVICE_KEY = '@RNBase/auth';
const USERNAME_KEY = 'auth';

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  roleId: number | null;
  biometricEnabled: boolean;
};

// ── Token Storage (Keychain) ──────────────────────────────────────────────────

export async function saveTokens(data: {
  accessToken: string;
  refreshToken: string;
  userId?: number;
  roleId?: number | null;
  biometricEnabled?: boolean;
}): Promise<void> {
  // Read existing to merge optional fields
  const existing = await getTokens();

  const payload: StoredTokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    userId: data.userId ?? existing?.userId ?? 0,
    roleId: data.roleId !== undefined ? data.roleId : (existing?.roleId ?? null),
    biometricEnabled: data.biometricEnabled !== undefined
      ? data.biometricEnabled
      : (existing?.biometricEnabled ?? false),
  };

  await Keychain.setGenericPassword(USERNAME_KEY, JSON.stringify(payload), {
    service: SERVICE_KEY,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getTokens(): Promise<StoredTokens | null> {
  try {
    const result = await Keychain.getGenericPassword({service: SERVICE_KEY});
    if (!result) return null;

    const parsed = JSON.parse(result.password) as Partial<StoredTokens>;
    if (!parsed.accessToken || !parsed.refreshToken || !parsed.userId) return null;

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      userId: Number(parsed.userId),
      roleId: parsed.roleId ?? null,
      biometricEnabled: parsed.biometricEnabled ?? false,
    };
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({service: SERVICE_KEY});
  } catch {
    // ignore cleanup errors
  }
}

// ── Biometric flag ────────────────────────────────────────────────────────────
// Stored as part of the main token blob — no separate service needed.

export async function saveBiometricEnabled(enabled: boolean): Promise<void> {
  await saveTokens({
    // Provide dummy values — saveTokens will merge with existing data
    accessToken: '',
    refreshToken: '',
    biometricEnabled: enabled,
  });
}

export async function getBiometricEnabled(): Promise<boolean> {
  const tokens = await getTokens();
  return tokens?.biometricEnabled ?? false;
}
