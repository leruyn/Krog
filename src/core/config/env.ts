import DeviceInfo from 'react-native-device-info';

export type AppEnvName = 'development' | 'staging' | 'production';

function resolveAppEnvName(): AppEnvName {
  try {
    const bid = DeviceInfo.getBundleId().toLowerCase();
    if (bid.endsWith('.dev')) return 'development';
    if (bid.endsWith('.stag')) return 'staging';
    return 'production';
  } catch {
    return __DEV__ ? 'development' : 'production';
  }
}

/**
 * Centralized JS config — single source of truth.
 * Không dùng .env file, chỉnh tại đây thôi.
 */
export const ENV = {
  name: resolveAppEnvName(),
  /** Base URL của REST API. Thay đổi theo project. */
  apiBaseUrl: 'http://localhost:3000',
  /** Timeout cho mỗi request (ms). */
  requestTimeoutMs: 60_000,
  get isDev() {
    return this.name === 'development';
  },
  get isProd() {
    return this.name === 'production';
  },
} as const;
