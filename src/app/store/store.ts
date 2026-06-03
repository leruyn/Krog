import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from '@features/auth/store/authSlice';

/**
 * Redux Store
 *
 * To add a new reducer:
 * 1. Import it here
 * 2. Add to the `reducer` map below
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // [FEATURE]: add new reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // React Navigation & Axios errors may contain non-serializable data
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
