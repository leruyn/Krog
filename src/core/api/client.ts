import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import {ENV} from '@core/config/env';
import {AppError} from '@core/errors/appError';
import './types';
import {normalizeApiPath} from './joinApiUrl';
import {refreshAccessToken, REFRESH_TOKEN_PATH} from './refreshAccessToken';

const LOGIN_PATH = '/auth/login';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type ApiClientAuthHandlers = {
  onTokensRefreshed?: (tokens: AuthTokens) => void;
  onSessionExpired?: () => void;
};

// ─── Error Mapping ──────────────────────────────────────────────────────────

function toAppError(err: unknown): AppError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<any>;
    const status = ax.response?.status;
    const message =
      ax.response?.data?.message ??
      ax.response?.data?.error ??
      ax.message ??
      'Request failed';

    if (ax.code === 'ERR_CANCELED') {
      return new AppError({code: 'CANCELLED', message, status, details: ax.response?.data, source: 'api'});
    }
    if (ax.code === 'ECONNABORTED') {
      return new AppError({code: 'TIMEOUT', message, status, details: ax.response?.data, source: 'api'});
    }
    if (!status) {
      return new AppError({code: 'NETWORK_ERROR', message, details: ax.response?.data, source: 'api'});
    }
    if (status === 401) {
      return new AppError({code: 'UNAUTHORIZED', message, status, details: ax.response?.data, source: 'api'});
    }
    if (status === 403) {
      return new AppError({code: 'FORBIDDEN', message, status, details: ax.response?.data, source: 'api'});
    }
    if (status === 404) {
      return new AppError({code: 'NOT_FOUND', message, status, details: ax.response?.data, source: 'api'});
    }
    if (status === 400 || status === 422) {
      return new AppError({code: 'VALIDATION_ERROR', message, status, details: ax.response?.data, source: 'api'});
    }
    if (status >= 500) {
      return new AppError({code: 'SERVER_ERROR', message, status, details: ax.response?.data, source: 'api'});
    }
    return new AppError({code: 'UNKNOWN_ERROR', message, status, details: ax.response?.data, source: 'api'});
  }
  if (err instanceof AppError) return err;
  if (err instanceof Error) {
    return new AppError({code: 'UNKNOWN_ERROR', message: err.message, source: 'api'});
  }
  return new AppError({code: 'UNKNOWN_ERROR', message: 'Unknown error', details: err, source: 'api'});
}

// ─── Auth Refresh Helpers ────────────────────────────────────────────────────

function shouldSkipAuthRefresh(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? '';
  return (
    Boolean(config.skipAuthRefresh) ||
    url.includes(LOGIN_PATH) ||
    url.includes(REFRESH_TOKEN_PATH) ||
    Boolean(config._retry)
  );
}

type RefreshQueueEntry = {
  resolve: (accessToken: string) => void;
  reject: (error: unknown) => void;
};

// ─── ApiClient Class ─────────────────────────────────────────────────────────

class ApiClient {
  private client: AxiosInstance;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshQueue: RefreshQueueEntry[] = [];
  private authHandlers: ApiClientAuthHandlers = {};

  constructor() {
    this.client = axios.create({
      baseURL: ENV.apiBaseUrl,
      timeout: ENV.requestTimeoutMs,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (config.url) {
        config.url = normalizeApiPath(config.url);
      }
      return config;
    });

    this.client.interceptors.response.use(
      (res) => res,
      (err) => this.handleResponseError(err),
    );
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  configureAuth(handlers: ApiClientAuthHandlers) {
    this.authHandlers = handlers;
  }

  // ── Tokens ────────────────────────────────────────────────────────────────

  setAuthToken(token: string | null) {
    if (!token) {
      delete this.client.defaults.headers.common.Authorization;
      return;
    }
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  setRefreshToken(token: string | null) {
    this.refreshToken = token;
  }

  setTokens(accessToken: string | null, refreshToken: string | null) {
    this.setAuthToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  // ── Base URL ──────────────────────────────────────────────────────────────

  setBaseUrl(baseUrl: string) {
    this.client.defaults.baseURL = baseUrl.trim().replace(/\/+$/, '');
  }

  getBaseUrl(): string {
    const base = this.client.defaults.baseURL;
    return typeof base === 'string' && base.length > 0 ? base : ENV.apiBaseUrl;
  }

  get instance() {
    return this.client;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private processRefreshQueue(error: unknown | null, accessToken: string | null) {
    this.refreshQueue.forEach((entry) => {
      if (error) {
        entry.reject(error);
      } else if (accessToken) {
        entry.resolve(accessToken);
      }
    });
    this.refreshQueue = [];
  }

  private applyTokens(tokens: AuthTokens) {
    this.setAuthToken(tokens.accessToken);
    this.setRefreshToken(tokens.refreshToken);
    this.authHandlers.onTokensRefreshed?.(tokens);
  }

  private clearSession() {
    this.setTokens(null, null);
    this.authHandlers.onSessionExpired?.();
  }

  private async handleResponseError(err: unknown) {
    if (!axios.isAxiosError(err)) {
      return Promise.reject(toAppError(err));
    }

    const axiosError = err as AxiosError;
    const status = axiosError.response?.status;
    const originalRequest = axiosError.config as
      | (InternalAxiosRequestConfig & {_retry?: boolean})
      | undefined;

    if (status !== 401 || !originalRequest || shouldSkipAuthRefresh(originalRequest)) {
      return Promise.reject(toAppError(err));
    }

    if (!this.refreshToken) {
      this.clearSession();
      return Promise.reject(toAppError(err));
    }

    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.refreshQueue.push({resolve, reject});
      }).then((accessToken) => {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return this.client(originalRequest);
      });
    }

    originalRequest._retry = true;
    this.isRefreshing = true;

    try {
      const baseUrl = this.client.defaults.baseURL ?? ENV.apiBaseUrl;
      const tokens = await refreshAccessToken(baseUrl, this.refreshToken);
      this.applyTokens(tokens);
      this.processRefreshQueue(null, tokens.accessToken);
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return this.client(originalRequest);
    } catch (refreshError) {
      this.processRefreshQueue(refreshError, null);
      this.clearSession();
      return Promise.reject(toAppError(refreshError));
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const apiClient = new ApiClient();
