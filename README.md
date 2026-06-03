# react_native_base

> Base template cho mọi dự án React Native tại Dcorp.  
> Trích xuất & chuẩn hóa từ kiến trúc **SkyMonitor v7**.

---

## Tech Stack

| Mục | Thư viện |
|---|---|
| UI Framework | React Native 0.85 + React 19 |
| Navigation | React Navigation v7 (native-stack + bottom-tabs) |
| State | Redux Toolkit + React Query v5 |
| Theme | @shopify/restyle |
| API Client | Axios (custom `ApiClient` class) |
| Forms | react-hook-form |
| i18n | i18next + react-i18next |
| Secure Storage | react-native-keychain |
| Crash Reporting | Sentry |
| Animation | Lottie + react-native-reanimated |

---

## Kiến trúc thư mục

```
src/
├── app/                  # Bootstrap: Providers, Store, Navigation
│   ├── AppProviders.tsx
│   ├── SplashGate.tsx
│   ├── index.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx     # Root stack (auth-gated)
│   │   └── index.ts
│   └── store/
│       ├── store.ts             # configureStore
│       └── hooks.ts             # useAppDispatch / useAppSelector
│
├── core/                 # Hạ tầng dùng chung toàn app
│   ├── api/
│   │   ├── client.ts            # ApiClient singleton (token refresh, interceptors)
│   │   ├── refreshAccessToken.ts
│   │   ├── joinApiUrl.ts
│   │   └── types.ts
│   ├── config/
│   │   └── env.ts               # APP ENV (apiBaseUrl, timeout, sentry DSN)
│   ├── errors/
│   │   ├── appError.ts          # AppError class + error codes
│   │   └── errorMessage.ts
│   ├── i18n/
│   │   ├── index.ts             # initI18n(), setAppLanguage()
│   │   ├── resources.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── vi.json
│   ├── sentry/
│   │   └── reportApiFailure.ts
│   └── theme/
│       ├── theme.ts             # lightTheme / darkTheme
│       ├── themeProvider.tsx    # ThemeProvider + useTheme()
│       ├── index.ts
│       └── configs/
│           ├── colors.light.ts
│           ├── colors.dark.ts
│           ├── spacing.ts
│           ├── borderRadii.ts
│           ├── borderWidths.ts
│           ├── fonts.ts
│           ├── typography.ts
│           ├── button.ts
│           ├── iconSizes.ts
│           ├── opacity.ts
│           ├── avatar.ts
│           └── index.ts
│
├── features/             # Business features (mỗi feature = module độc lập)
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   │   └── AuthBootstrap.tsx  # Hydrate tokens on app start
│   │   ├── screens/
│   │   │   └── LoginScreen.tsx
│   │   ├── services/
│   │   │   └── tokenStorage.ts    # Keychain-backed token persistence
│   │   ├── store/
│   │   │   └── authSlice.ts
│   │   ├── types.ts
│   │   └── index.ts
│   └── index.ts
│
├── shared/               # UI primitives & utilities dùng lại mọi nơi
│   ├── components/
│   │   ├── primitives.ts         # Box + Text (restyle)
│   │   ├── Button.tsx
│   │   ├── InputField.tsx
│   │   ├── TextInput.tsx
│   │   ├── Card.tsx
│   │   ├── ScreenContainer.tsx
│   │   ├── EmptyRetryPanel.tsx
│   │   └── index.ts
│   ├── hocs/
│   │   └── withAuth.tsx
│   ├── navigation/
│   │   └── index.ts
│   └── utils/
│       └── numberDisplay.ts
│
├── assets/
│   ├── animations/       # Lottie JSON
│   ├── fonts/            # TTF font files
│   └── images/
│
└── types/                # Global TypeScript declarations
    └── index.ts
```

---

## Quy ước Feature Module

Mỗi feature trong `src/features/<name>/` tuân theo cấu trúc:

```
<feature>/
├── api/          # API calls (axios), chỉ gọi apiClient
├── components/   # Các component nội bộ feature (không export ra ngoài)
├── hooks/        # Custom hooks của feature
├── locales/      # en.json, vi.json (namespace riêng)
├── screens/      # Screen components
├── services/     # Business logic, storage (không phải API)
├── store/        # Redux slice
├── types.ts      # Types nội bộ feature
└── index.ts      # Public API: chỉ export những gì cần ra ngoài
```

---

## Path Aliases (babel.config.js)

```
@app      → src/app
@core     → src/core
@features → src/features
@shared   → src/shared
@assets   → src/assets
@typings  → src/types
```

---

## Getting Started

```bash
# Cài dependencies
yarn install

# Run iOS (Dev)
yarn ios:dev

# Run Android (Dev)
yarn android:dev

# Lint
yarn lint

# Test
yarn test
```

---

## Tạo Feature Mới

1. Copy cấu trúc từ `src/features/auth/` làm template.
2. Tạo Redux slice trong `store/authSlice.ts` → đăng ký vào `src/app/store/store.ts`.
3. Thêm screens vào `AppNavigator.tsx` (hoặc Tab navigator tương ứng).
4. Thêm i18n namespace vào `src/core/i18n/resources.ts`.
5. Export public API qua `index.ts`.
