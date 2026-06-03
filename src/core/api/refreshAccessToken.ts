import axios from 'axios';
import {ENV} from '@core/config/env';
import {AppError} from '@core/errors/appError';
import {joinApiUrl} from './joinApiUrl';

export const REFRESH_TOKEN_PATH = '/auth/refresh_token';

type RefreshTokenApiResponse = {
  error?: string;
  message?: string;
  token?: {
    access_token: string;
    refresh_token?: string;
  };
};

export type RefreshedTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function refreshAccessToken(
  baseUrl: string,
  refreshToken: string,
): Promise<RefreshedTokens> {
  const {data} = await axios.post<RefreshTokenApiResponse>(
    joinApiUrl(baseUrl, REFRESH_TOKEN_PATH),
    {refresh_token: refreshToken},
    {
      timeout: ENV.requestTimeoutMs,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  if (data?.error) {
    throw new AppError({
      code: 'UNAUTHORIZED',
      message: data.message ?? 'Session expired',
      status: 401,
      details: data,
      source: 'business',
    });
  }

  const accessToken = data?.token?.access_token;
  if (!accessToken) {
    throw new AppError({
      code: 'UNAUTHORIZED',
      message: data?.message ?? 'Invalid refresh response',
      status: 401,
      details: data,
      source: 'api',
    });
  }

  return {
    accessToken,
    refreshToken: data.token?.refresh_token ?? refreshToken,
  };
}
