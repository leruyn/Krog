import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  /** Role-based access control - null means no role restriction */
  roleId: number | null;
  /** True once tokens have been loaded from storage (even if no tokens found) */
  isHydrated: boolean;
  biometricEnabled: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  roleId: null,
  isHydrated: false,
  biometricEnabled: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called on app boot: restores all auth state from secure storage.
     */
    hydrate(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        userId: number;
        roleId: number | null;
        biometricEnabled: boolean;
      }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.roleId = action.payload.roleId;
      state.biometricEnabled = action.payload.biometricEnabled;
      state.isHydrated = true;
    },

    /**
     * Called after login API success.
     */
    loginSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        userId: number;
        roleId: number | null;
      }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.roleId = action.payload.roleId;
      state.isHydrated = true;
    },

    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },

    setRefreshToken(state, action: PayloadAction<string | null>) {
      state.refreshToken = action.payload;
    },

    setHydrated(state, action: PayloadAction<boolean>) {
      state.isHydrated = action.payload;
    },

    setBiometricEnabled(state, action: PayloadAction<boolean>) {
      state.biometricEnabled = action.payload;
    },

    /**
     * Clear all auth state. Called on logout or session expiry.
     */
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.roleId = null;
      state.biometricEnabled = false;
      state.isHydrated = true; // Keep hydrated=true to prevent re-showing splash
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
