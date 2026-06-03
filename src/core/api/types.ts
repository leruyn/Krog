import {InternalAxiosRequestConfig} from 'axios';

// Augment Axios types to support custom flags
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** Skip token refresh on 401 for this request. */
    skipAuthRefresh?: boolean;
    /** Mark request as a retry to prevent infinite loops. */
    _retry?: boolean;
  }
}
