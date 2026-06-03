# Checklist khi tạo dự án mới từ react_native_base

## Bước 1: Clone & Rename

- [ ] Copy thư mục `react_native_base` → đổi tên thành tên project
- [ ] `package.json` → đổi `"name"`, `"version": "1.0.0"`
- [ ] `app.json` → đổi `"name"` và `"displayName"`
- [ ] `android/app/build.gradle` → đổi `applicationId`
- [ ] Xcode → Project settings → Bundle Identifier

## Bước 2: Theme / Branding

- [ ] `src/core/theme/configs/colors.light.ts` — thay `primary`, `primaryDark`, `buttonPrimary`
- [ ] `src/core/theme/configs/colors.dark.ts` — mirror tương ứng
- [ ] `src/core/theme/configs/fonts.ts` — thay `fontFamilies` với font của project
- [ ] Bundle font: `android/app/src/main/assets/fonts/*.ttf`
- [ ] Bundle font: `ios/<App>/Info.plist` → `UIAppFonts`
- [ ] `src/app/SplashGate.tsx` — thay `SPLASH_BG` + uncomment `LottieView`

## Bước 3: Configuration

- [ ] `src/core/config/env.ts` — update `apiBaseUrl`
- [ ] `src/core/i18n/index.ts` — đổi `LANGUAGE_STORAGE_KEY` prefix
- [ ] `src/features/auth/services/tokenStorage.ts` — đổi `SERVICE_KEY` prefix

## Bước 4: API Auth

- [ ] `src/features/auth/screens/LoginScreen.tsx` — update login endpoint + response shape
- [ ] `src/core/api/refreshAccessToken.ts` — update `REFRESH_TOKEN_PATH` nếu khác `/auth/refresh_token`

## Bước 5: Navigation

- [ ] `src/app/navigation/AppNavigator.tsx` — thêm screens sau đăng nhập
- [ ] Nếu cần bottom tabs → tạo `src/app/navigation/MainTabNavigator.tsx`

## Bước 6: Cleanup

- [ ] Xóa file này sau khi hoàn thành setup
- [ ] Update `README.md` với thông tin project thực

---

> Sau khi xong checklist → xem `docs/NEW_FEATURE_GUIDE.md` để tạo feature đầu tiên.
