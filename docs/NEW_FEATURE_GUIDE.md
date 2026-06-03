# Hướng dẫn tạo Feature mới

## Cấu trúc

Mỗi feature nằm trong `src/features/<feature-name>/` và tuân theo cấu trúc:

```
src/features/<feature-name>/
├── api/
│   └── <feature>Api.ts      # Axios calls via apiClient
├── components/
│   └── *.tsx                # Internal UI components (không export ra ngoài feature)
├── hooks/
│   └── use<Feature>.ts      # Custom hooks
├── locales/
│   ├── en.json              # i18n strings (namespace: feature-name)
│   └── vi.json
├── screens/
│   └── <Feature>Screen.tsx  # Screen components
├── services/
│   └── <feature>Storage.ts  # AsyncStorage / Keychain business logic
├── store/
│   └── <feature>Slice.ts    # Redux slice
├── types.ts                 # Feature-local TypeScript types
└── index.ts                 # Public API (chỉ export cái cần ra ngoài)
```

---

## Step-by-step

### 1. Tạo thư mục feature

```bash
mkdir -p src/features/my-feature/{api,components,hooks,locales,screens,services,store}
```

### 2. Tạo Redux Slice

```typescript
// src/features/my-feature/store/myFeatureSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type MyFeatureState = {
  // define state shape
};

const initialState: MyFeatureState = {};

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState,
  reducers: {
    // actions
  },
});

export const myFeatureActions = myFeatureSlice.actions;
export const myFeatureReducer = myFeatureSlice.reducer;
```

### 3. Đăng ký Reducer vào Store

```typescript
// src/app/store/store.ts
import {myFeatureReducer} from '@features/my-feature/store/myFeatureSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    myFeature: myFeatureReducer, // ← thêm vào đây
  },
  // ...
});
```

### 4. Tạo API Service

```typescript
// src/features/my-feature/api/myFeatureApi.ts
import {apiClient} from '@core/api/client';

export async function fetchItems() {
  const {data} = await apiClient.instance.get('/my-feature/items');
  return data;
}
```

### 5. Tạo React Query Hook

```typescript
// src/features/my-feature/hooks/useItems.ts
import {useQuery} from '@tanstack/react-query';
import {fetchItems} from '../api/myFeatureApi';

export function useItems() {
  return useQuery({
    queryKey: ['my-feature', 'items'],
    queryFn: fetchItems,
  });
}
```

### 6. Thêm i18n Namespace

```json
// src/features/my-feature/locales/vi.json
{
  "title": "Tiêu đề",
  "empty": "Không có dữ liệu"
}
```

```typescript
// src/core/i18n/resources.ts — thêm import:
import viMyFeature from '../../features/my-feature/locales/vi.json';
import enMyFeature from '../../features/my-feature/locales/en.json';

export const resources = {
  vi: { ..., myFeature: viMyFeature },
  en: { ..., myFeature: enMyFeature },
};
```

### 7. Tạo Screen

```typescript
// src/features/my-feature/screens/MyFeatureScreen.tsx
import React from 'react';
import {ScreenContainer} from '@shared/components';
import {useItems} from '../hooks/useItems';

export function MyFeatureScreen() {
  const {data, isLoading, error, refetch} = useItems();

  return (
    <ScreenContainer>
      {/* content */}
    </ScreenContainer>
  );
}
```

### 8. Đăng ký Screen vào Navigator

```typescript
// src/app/navigation/AppNavigator.tsx
export type RootStackParamList = {
  // ...
  MyFeature: undefined; // ← thêm
};

// Trong Stack.Navigator:
<Stack.Screen name="MyFeature" component={MyFeatureScreen} />
```

### 9. Export Public API

```typescript
// src/features/my-feature/index.ts
export {myFeatureActions, myFeatureReducer} from './store/myFeatureSlice';
export {MyFeatureScreen} from './screens/MyFeatureScreen';
// Chỉ export những gì cần thiết ra ngoài
```

---

## Quy tắc

| Quy tắc | Lý do |
|---|---|
| Mọi API call đều qua `apiClient.instance` | Đảm bảo auth header + token refresh |
| Không import trực tiếp từ feature khác (dùng `index.ts`) | Giữ boundary rõ ràng |
| Không share Redux selectors trực tiếp ra ngoài | Tránh coupling |
| Mỗi feature có namespace i18n riêng | Tránh conflict key |
| `index.ts` là public API duy nhất của feature | Refactor dễ hơn |
