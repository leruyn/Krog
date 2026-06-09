# 🪓 KROG — Ứng Dụng Chiêm Nghiệm & Giải Sầu Thời Tiền Sử

> **"Nghĩ nhiều làm đầu Krog đau. Settle down by the campfire, smash some rocks, and write like a caveman."**

---

## 🦖 Ý Nghĩa Của Dự Án Krog

Trong thời đại công sở xô bồ, **Krog** ra đời như một liệu pháp giải tỏa căng thẳng (Stress Relief) độc đáo dành cho "người tiền sử văn phòng". 

App lấy cảm hứng từ góc nhìn tối giản của thời đại đồ đá: Mọi phiền muộn phức tạp của thế giới hiện đại (như KPIs, deadline ngập đầu, sếp phàn nàn, lương chậm...) thực chất chỉ là những mối đe dọa sinh tồn cơ bản mà tổ tiên ta đã đối mặt hàng vạn năm trước. 

Bằng cách dịch thuật những dòng trạng thái stress sang **Ngôn ngữ bộ tộc Krog** giản đơn (ví dụ: *Sếp giao deadline dồn dập* chuyển thành *Tộc trưởng đuổi thú dữ dí sau mông*), ứng dụng giúp người dùng nhìn nhận lại áp lực công việc dưới một lăng kính hài hước, mộc mạc và nhẹ lòng hơn.

---

## 🔥 Các Tính Năng "Xịn Xò" Trải Nghiệm

### 1. Hang Sưởi Ấm (Eternal Bonfire Home Screen)
*   **Giao diện Hang Tối Ấm Cúng:** Không gian hang đá tiền sử tách biệt hoàn toàn với ánh sáng xanh văn phòng.
*   **Hộp Điều Khiển Tài Nguyên (HUD):** Hiển thị trực quan quỹ **Đá (`🪨`)** và **Vỏ Sò (`🐚`)** của bộ tộc.
*   **Đống Lửa Bập Bùng (5-Layer Flame Stack Engine):** Ngọn lửa SVG đa lớp được hoạt ảnh hoá bằng chu kỳ co giãn (`scale`) và đong đưa (`sway`) lệch pha ngẫu nhiên, tạo hiệu ứng lửa trại chân thật nhất.
*   **Tàn Lửa Bay Bay (Embers Particles):** Các hạt tàn lửa nhỏ liên tục bay lên từ đống lửa và tiêu biến dần trong không khí.
*   **Khói Chữ Đàn Hồi (Rising Spark Text):** Chạm vào lửa để ngọn lửa bùng lên (Spring Surge) đồng thời phát ra các dòng chữ cảm thán trôi ngược lên trên như làn khói.
*   **Vật Nuôi Đồng Hành:** 
    *   🍖 *Voi Ma-mút béo ngậy* quay đều trên giàn nướng.
    *   🦖 *Khủng long T-Rex Éc* nhảy cẫng lên ăn mừng và lầm bầm khi bị chạm vào.

### 2. Nhật Ký Vách Đá (Caveman Translator)
*   **Hòn Đá Phép Thuật:** Nhập các dòng nhật ký văn phòng mệt mỏi và "khắc chìm" chúng vào đá. 
*   **Từ Điển Bộ Tộc Krog:**
    *   *Đi làm, làm việc* ➔ *Săn bắn, bẩy đá*
    *   *Lương, tiền* ➔ *Vỏ sò lấp lánh*
    *   *Sếp, quản lý* ➔ *Tộc trưởng hung dữ*
    *   *Deadline* ➔ *Thú dữ đuổi dồn dập*
    *   *Stress, mệt mỏi* ➔ *Đầu bốc khói, lưng đau nhừ*
    *   *Máy tính, điện thoại* ➔ *Phiến đá phát sáng*

### 3. Đập Đá Giải Sầu (Rock Crusher)
*   Nơi trút giận hoàn hảo! Dùng rìu đập nứt các khối đá granite cứng đầu để nhận lại tài nguyên Đá và Vỏ sò tươi, kèm theo hiệu ứng rung phản hồi vật lý cực kỳ đã tay.

### 4. Vẽ Bậy Lên Vách (Cave Canvas)
*   Thoả sức sáng tạo các bức hoạ hang động cổ xưa ngay trên chất liệu đá ráp sần sùi bằng cọ vẽ thô sơ.

---

## 🛠️ Công Nghệ & Kiến Trúc Dự Án

Ứng dụng được xây dựng dựa trên cấu trúc vững chãi của nền tảng di động hiện đại:

| Thành phần | Công nghệ sử dụng |
|---|---|
| **Core Framework** | React Native 0.85 + React 19 (TypeScript) |
| **Gia tốc Đồ hoạ** | React Native SVG (vẽ ngọn lửa, vector, bia đá) |
| **Hệ thống Animation** | React Native Animated API (hạt tàn lửa, sways, spring scale) |
| **Quản lý State** | Redux Toolkit (global app state) + React Query v5 |
| **Bộ nhớ cục bộ** | AsyncStorage local-first (lưu trữ nhật ký, số đá, vỏ sò) |
| **Cấu hình Font** | Pangolin Font (Google Fonts) tích hợp sâu vào Native Assets |

### 📂 Cấu Trúc Thư Mục Chuẩn Hóa
```
src/
├── app/                  # Nơi khởi chạy: Providers, Store, Navigation
├── core/                 # Hạ tầng dùng chung (i18n, ApiClient, theme Restyle)
│   └── theme/configs/    # Cấu hình font chữ Pangolin & typography toàn hệ thống
├── features/             # Các mô-đun độc lập (Chức năng cốt lõi Krog)
│   └── krog/
│       ├── components/   # Svg Icons vẽ tay độc quyền
│       ├── context/      # KrogStateContext quản lý tài nguyên và thú nuôi
│       ├── navigation/   # KrogTabNavigator điều phối 4 tab chính
│       └── screens/      # WisdomScreen (Home), Crusher, Canvas, Diary
└── shared/               # Component nguyên tử dùng chung
```

---

## 🚀 Cài Đặt Khởi Chạy

Chạy các lệnh dưới đây từ thư mục gốc của dự án `Krog`:

```bash
# 1. Cài đặt các thư viện phụ thuộc
yarn install

# 2. Cài đặt Pods cho môi trường iOS (chỉ trên macOS)
cd ios && pod install && cd ..

# 3. Chạy ứng dụng trên môi trường giả lập iOS
yarn ios:dev

# 4. Chạy ứng dụng trên môi trường giả lập Android
yarn android:dev

# 5. Kiểm tra lỗi kiểu dữ liệu tĩnh (TypeScript)
yarn type-check
```

---

## 🪨 Quy Ước Phát Triển Bộ Tộc Krog
*   **Local-First:** Mọi dữ liệu về nhật ký vách đá, số đá đập được đều được lưu trữ hoàn toàn dưới thiết bị.
*   **Trải nghiệm Rung (Vibe):** Giữ gìn các phương thức trong [vibe.ts](file:///Users/leruyn/Project/Other/Krog/src/features/krog/utils/vibe.ts) khi người dùng chạm lửa, đập đá hay khắc nhật ký để giữ độ chân thật.
*   **Giữ gìn bản sắc Krog:** Mọi tính năng mới nên được dịch nghĩa sang thế giới đồ đá trước khi đưa vào giao diện người dùng.

---
*Chúc các Krog săn bắn nhiều hổ béo và tích lũy được nhiều vỏ sò lấp lánh! 🪓🔥🦖*
