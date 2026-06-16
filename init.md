# Campuss — Barcode Attendance System

> A React Native mobile application for taking student/employee attendance via barcode scanning. The app uses a device camera to scan barcodes (EAN-13, QR, Code-128, etc.), sends the scanned ID to a backend API, and displays real-time attendance records with filtering capabilities. The dashboard is **role-based** — teachers/admins see an enhanced view with analytics and CSV export, while regular users see a streamlined attendance list.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Architecture](#architecture)
7. [Navigation](#navigation)
8. [Screens](#screens)
9. [Role-Based Views](#role-based-views)
10. [State Management (Redux)](#state-management-redux)
11. [API Endpoints](#api-endpoints)
12. [Reusable Components](#reusable-components)
13. [Theme System](#theme-system)
14. [Assets](#assets)
15. [Key Libraries](#key-libraries)
16. [Scope of Work](#scope-of-work)

---

## Overview

| Property        | Value            |
| --------------- | ---------------- |
| **App Name**    | Campuss          |
| **Display Name**| Campuss          |
| **Version**     | 0.0.1            |
| **React Native**| 0.84.1           |
| **React**       | 19.2.3           |
| **Node Engine**  | >= 22.11.0       |
| **Platforms**   | Android & iOS    |

**Campuss** is an attendance management app designed for educational institutions. A logged-in user (teacher/admin/student) can:

- **Login** with username & password (JWT-based authentication).
- **View a role-based dashboard** — the app detects the user's role (`1` = User/Student, `2` = Teacher/Admin) and renders an appropriate view:
  - **User View (Role 1):** Attendance stats (Total, IN, OUT, Absent), attendance list with status pills, date filter, and sync FAB.
  - **Teacher View (Role 2):** Enhanced dashboard with attendance rate progress bar, 2×2 stats grid with icon backgrounds, CSV/Excel export, date filter, empty-state placeholder, and sync FAB.
- **Scan barcodes** using the device camera to mark attendance (IN or OUT) for students.
- **Filter attendance** records by date using a date picker.
- **Export attendance** to CSV (Teacher/Admin only) — downloads to device storage and optionally shares.
- **Sync** attendance data on demand via a FAB (Floating Action Button).
- **View their profile** — full name, email, role, and employee ID.
- **Logout** — clears the session token and returns to the login screen.

---

## Tech Stack

| Category              | Technology                                                            |
| --------------------- | --------------------------------------------------------------------- |
| **Framework**         | React Native 0.84.1 (New Architecture)                               |
| **Language**          | JavaScript (ES6+)                                                     |
| **State Management**  | Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)                    |
| **Navigation**        | React Navigation v7 (`@react-navigation/native`, `@react-navigation/bottom-tabs`) |
| **HTTP Client**       | Axios                                                                 |
| **Camera / Scanner**  | `react-native-vision-camera` v4 + built-in code scanner              |
| **Animations**        | React Native Reanimated v4 + `Animated` API                          |
| **Storage**           | `@react-native-async-storage/async-storage`                          |
| **File System**       | `react-native-fs` (for CSV export to device storage)                 |
| **Sharing**           | `react-native-share` (for sharing exported CSV reports)              |
| **Icons**             | FontAwesome (via `@fortawesome/react-native-fontawesome`)             |
| **SVG**               | `react-native-svg`                                                    |
| **Date Picker**       | `react-native-date-picker`                                           |
| **Safe Area**         | `react-native-safe-area-context`                                      |
| **Environment Config**| `react-native-config`                                                 |
| **Gestures**          | `react-native-gesture-handler`                                        |
| **Worklets**          | `react-native-worklets` (required by vision-camera)                   |

---

## Project Structure

```
Campuss/
├── .env                          # Environment variables (BASE_URL)
├── App.js                        # Root component (Redux Provider + SafeAreaProvider + RootNavigator)
├── index.js                      # App registry entry point
├── app.json                      # App name & display name config
├── package.json                  # Dependencies & scripts
├── babel.config.js               # Babel preset + Reanimated plugin
├── metro.config.js               # Metro bundler config
│
├── assets/                       # Static assets
│   ├── Campuss_Icon.png          # App icon (PNG)
│   ├── Campuss Icon.ico          # App icon (ICO)
│   ├── Vector.png                # Decorative vector
│   ├── enter_pass.png            # Login screen illustration
│   └── login_vector.svg          # Login vector (SVG)
│
├── src/
│   ├── app/
│   │   └── store.js              # Redux store configuration
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Button.js             # Multi-variant button (primary / secondary / outline)
│   │   ├── Card.js               # Shadowed card container (touchable or static)
│   │   ├── Input.js              # Styled text input with border
│   │   ├── TeacherView.js        # [NEW] Teacher/Admin dashboard view with analytics & CSV export
│   │   └── UserView.js           # [NEW] User/Student dashboard view with attendance list
│   │
│   ├── features/                 # Feature-based modules (screen + slice)
│   │   ├── auth/
│   │   │   ├── LoginScreen.js    # Login UI (username + password form)
│   │   │   └── authSlice.js      # Auth state: login, token persistence, logout
│   │   │
│   │   ├── home/
│   │   │   ├── HomeScreen.js     # [MODIFIED] Role-based router: renders TeacherView or UserView
│   │   │   └── homeSlice.js      # Home state: fetch attendance, add/update/clear
│   │   │
│   │   ├── scanner/
│   │   │   ├── ScannerScreen.js  # Full-screen camera for barcode scanning
│   │   │   └── scannerSlice.js   # Scanner state: send attendance, store scan response
│   │   │
│   │   └── profile/
│   │       ├── ProfileScreen.js  # User profile: avatar, account info card, logout button
│   │       └── profileSlice.js   # Profile state: fetch & store user profile
│   │
│   ├── navigation/
│   │   ├── RootNavigator.js      # Auth gate: shows LoginScreen or BottomTabs based on token
│   │   └── BottomTabs.js         # Custom animated bottom tab bar with 3 tabs
│   │
│   └── theme/                    # Design tokens
│       ├── Colours.js            # Color palette (brand, background, text, border, status)
│       ├── Typo.js               # Typography scale (title, heading, body, caption)
│       └── Spacing.js            # Spacing scale (xs → xl: 4, 8, 16, 24, 32)
│
├── android/                      # Android native project
├── ios/                          # iOS native project
└── __tests__/                    # Jest test directory
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 22.11.0
- **React Native CLI** (`@react-native-community/cli`)
- **Android Studio** (for Android) or **Xcode** (for iOS)
- **Ruby & Bundler** (for iOS CocoaPods via `Gemfile`)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd Campuss

# 2. Install JS dependencies
npm install

# 3. (iOS only) Install CocoaPods
cd ios && pod install && cd ..

# 4. Create .env file in root
echo "BASE_URL = https://your-backend-url.com" > .env
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Available Scripts

| Script          | Command                      | Description                  |
| --------------- | ---------------------------- | ---------------------------- |
| `npm start`     | `react-native start`         | Start Metro dev server       |
| `npm run android` | `react-native run-android` | Build & run on Android       |
| `npm run ios`   | `react-native run-ios`       | Build & run on iOS           |
| `npm run lint`  | `eslint .`                   | Lint the codebase            |
| `npm test`      | `jest`                       | Run unit tests               |

---

## Environment Variables

Managed via `react-native-config`. Create a `.env` file in the project root:

```env
BASE_URL = https://your-backend-url.ngrok-free.dev
```

Accessed in code as:
```javascript
import Config from 'react-native-config';
const BASE_URL = Config.BASE_URL;
```

> **Note:** The app currently uses an ngrok tunnel URL for the backend. Replace this with your production/staging API URL.

---

## Architecture

The app follows a **feature-based architecture** with clear separation of concerns and **role-based UI rendering**:

```
┌─────────────────────────────────────────┐
│                 App.js                  │
│  SafeAreaProvider → Redux Provider      │
│              → RootNavigator            │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   No Token?             Has Token?
        │                     │
  ┌─────┴─────┐    ┌──────────┴──────────┐
  │LoginScreen│    │     BottomTabs       │
  └───────────┘    │  ┌─────┬─────┬────┐ │
                   │  │Home │Scan │Prof│ │
                   │  └──┬──┴─────┴────┘ │
                   └─────┼───────────────┘
                         │
              ┌──────────┴──────────┐
              │   HomeScreen        │
              │  (Role Router)      │
              │                     │
         Role = '2'           Role = '1'
              │               (default)
              │                     │
       ┌──────┴──────┐     ┌───────┴───────┐
       │ TeacherView │     │   UserView    │
       │ (Analytics, │     │ (Stats list,  │
       │  CSV Export) │     │  date filter) │
       └─────────────┘     └───────────────┘
```

### Data Flow

```
User Action → dispatch(asyncThunk) → API call (Axios)
    → Redux state update → UI re-render
```

### Authentication Flow

1. User enters credentials on `LoginScreen`
2. `loginUser` thunk POSTs to `/api/login`
3. On success, JWT token is stored in:
   - **Redux store** (`auth.token`)
   - **AsyncStorage** (persistence across app restarts)
4. `RootNavigator` conditionally renders `BottomTabs` (authenticated) or `LoginScreen` (unauthenticated)
5. On app launch, `loadTokenFromStorage` thunk restores the token from AsyncStorage
6. Logout clears both Redux state and AsyncStorage

### Role-Based Rendering Flow

1. After login, `HomeScreen` dispatches `fetchProfile(token)` to retrieve user data including `role`
2. `HomeScreen` reads `state.profile.role` from Redux
3. If `role === '2'` → renders `<TeacherView />` (teacher/admin dashboard)
4. Otherwise (role `'1'` or unknown) → renders `<UserView />` (student/user dashboard)
5. Both views share the same Redux state (`home.data`, `auth.token`, `profile`) but present different UIs

---

## Navigation

### RootNavigator (`src/navigation/RootNavigator.js`)

- Acts as an **authentication gate**
- Uses `useSelector` to read `state.auth.token`
- On mount, dispatches `loadTokenFromStorage()` to restore persisted sessions
- Renders `<LoginScreen />` if no token, `<BottomTabs />` if authenticated
- Includes debug logging of all AsyncStorage keys on navigation state changes

### BottomTabs (`src/navigation/BottomTabs.js`)

A fully **custom animated bottom tab bar** with 3 tabs:

| Tab       | Screen           | Icon       | Description                       |
| --------- | ---------------- | ---------- | --------------------------------- |
| **Home**  | `HomeScreen`     | `faHome`   | Role-based dashboard (UserView or TeacherView) |
| **Scan**  | `ScannerScreen`  | `faBarcode`| Camera-based barcode scanner      |
| **Profile** | `ProfileScreen`| `faUser`   | User profile & logout             |

**Custom Tab Bar Features:**
- Animated **sliding indicator** (bottom bar) using `Animated.spring`
- Animated **floating icon button** that follows the active tab
- SVG **bump shape** that animates behind the active tab
- Scale animation on the center (Scan) tab when focused
- Uses `react-native-svg` for custom tab bar shapes
- Dark-themed tab bar using `Colours.brand.primary`

---

## Screens

### 1. LoginScreen (`src/features/auth/LoginScreen.js`)

**Purpose:** User authentication

- Displays the Campuss logo/illustration and branding
- Two input fields: **Username** and **Password**
- **Login** button dispatches `loginUser()` thunk
- Shows error message on failed login ("Invalid Credentials")
- Loading state disables the button and shows "Logging in..."
- Footer text with "Sign up" link placeholder
- `KeyboardAvoidingView` for proper keyboard handling on iOS and Android
- Uses `Card`, `Input`, and `Button` reusable components

### 2. HomeScreen (`src/features/home/HomeScreen.js`)

**Purpose:** Role-based dashboard router

The HomeScreen no longer contains the dashboard UI directly. Instead, it acts as a **controller/router** that:

1. **Fetches initial data** on mount — dispatches `fetchProfile(token)` and `fetchAttendance({ token, date })` when token is available
2. **Requests camera permission** on mount (for barcode scanner readiness)
3. **Reads the user's role** from `state.profile.role`
4. **Renders the appropriate view** based on role:
   - `role === '2'` (Teacher/Admin) → `<TeacherView />`
   - `role === '1'` or default → `<UserView />`

**Role Constants:**
```javascript
const ROLE_USER = '1';
const ROLE_TEACHER = '2';
```

### 3. ScannerScreen (`src/features/scanner/ScannerScreen.js`)

**Purpose:** Full-screen barcode scanner for marking attendance

**Supported Barcode Types:**
`ean-13`, `qr`, `code-128`, `code-39`, `code-93`, `upc-a`, `upc-e`, `aztec`, `pdf-417`, `ean-8`

**Behavior:**
1. Requests camera permission (redirects to Settings if denied)
2. Opens full-screen camera using `react-native-vision-camera`
3. Continuously scans for barcodes using `useCodeScanner`
4. On scan detection:
   - Stores scanned ID in Redux (`setScannedData`)
   - Dispatches `sendAttendance({ id, token })` to API
   - Stops scanning (`isScanning = false`)
   - Navigates back to Home tab
5. Shows alert on successful attendance marking (with student name)
6. Shows error alert for 404 (student not found) or other errors
7. Camera is only active when: tab is focused + app is in foreground + scanning is enabled
8. Uses `AppState` listener to pause camera when app is backgrounded

### 4. ProfileScreen (`src/features/profile/ProfileScreen.js`)

**Purpose:** Display user profile and account actions

**Avatar Section:**
- Circular avatar with user icon (no photo — uses FontAwesome `faUser`)
- User's full name, email (monospace font), and role pill

**Account Info Card — 4 rows:**

| Field       | Icon            | Icon Color | Background |
| ----------- | --------------- | ---------- | ---------- |
| Full Name   | `faUser`        | #3B82F6    | #EEF2FF    |
| Email       | `faEnvelope`    | #EC4899    | #FDF2F8    |
| Role        | `faMapMarkerAlt`| #22C55E    | #DCFCE7    |
| Employee ID | `faIdBadge`     | #F59E0B    | #FEF3C7    |

**Role Display Logic:**
- Role `'1'` → displayed as "User"
- Other roles → displayed as "Role" (placeholder)

**Logout Button:**
- Red button at the bottom
- Dispatches `logout()` action → clears token from Redux + AsyncStorage

---

## Role-Based Views

### UserView (`src/components/UserView.js`)

**Purpose:** Dashboard view for users/students (Role 1)

A streamlined attendance dashboard designed for regular users.

**Header Section:**
- Institution name ("ABC College")
- Greeting card with user's first name, "User" role pill, and "Logged in" badge
- Formatted current date (e.g., "WED, 11 JUN 2026")

**Stats Row — 4 inline stat cards:**

| Stat      | Icon             | Color   | Calculation                           |
| --------- | ---------------- | ------- | ------------------------------------- |
| TOTAL     | `faUser`         | Primary | Total attendance records count        |
| IN        | `faCircleCheck`  | Green   | Records with `inTime` but no `outTime`|
| OUT       | `faSquareArrowUpRight` | Amber | Records with both `inTime` and `outTime` |
| ABSENT    | `faCircleXmark`  | Red     | Records with neither `inTime` nor `outTime` |

**Attendance List:**
- `FlatList` of attendance records
- Each row shows: **avatar** (initials), **name**, **course**, **status pill** (Present-IN / Present-OUT / ABSENT), and **check-in time**
- Status pills are color-coded: green (IN), amber (OUT), red (ABSENT)

**Actions:**
- **Filter button** → opens `DatePicker` modal to filter attendance by date
- **Sync FAB** (bottom-right) → re-fetches today's attendance data

**Key Dependencies:** `Card`, `Colours`, FontAwesome icons, Redux (`home.data`, `auth.token`, `profile`), `useBottomTabBarHeight`, `DatePicker`, `SafeAreaView`

---

### TeacherView (`src/components/TeacherView.js`)

**Purpose:** Enhanced dashboard view for teachers/admins (Role 2)

A feature-rich analytics dashboard with CSV export capability.

**Header Card:**
- Dark-themed card (`#1E3A5F` background) with shadow
- Greeting with user's first name + "Teacher / Admin" role pill with chart icon
- Current date badge
- **Attendance Rate progress bar** — shows percentage of students present (green fill on translucent background)

**Stats Grid — 2×2 layout with icon backgrounds:**

| Stat           | Icon             | Color   | Calculation                           |
| -------------- | ---------------- | ------- | ------------------------------------- |
| Total Students | `faUser`         | Primary | Total attendance records count        |
| Present IN     | `faCircleCheck`  | #10B981 | Records with `inTime` but no `outTime`|
| Present OUT    | `faSquareArrowUpRight` | #F59E0B | Records with `outTime`            |
| Absent         | `faCircleXmark`  | #EF4444 | Records with neither `inTime` nor `outTime` |

Each stat card includes a colored icon background circle (`color + '22'` alpha).

**Section Header with Actions:**
- Report title with chart bar icon
- **Filter button** → opens `DatePicker` modal (calendar icon with border styling)
- **Export button** (green background) → triggers CSV download

**Attendance Report List:**
- `FlatList` with `ReportRow` subcomponent
- Each row: **color-coded avatar** (green/amber/red based on status), **name**, **course** (with graduation cap icon), **status pill**, and **time**
- **Empty state** component when no data — shows chart icon with guidance text

**CSV Export Feature:**
1. Validates data exists
2. Requests storage permission (Android < 13)
3. Builds CSV with headers: `Name, Course, Status, In Time, Out Time`
4. Escapes CSV values properly (handles commas, quotes, newlines)
5. Writes file to device Downloads directory via `react-native-fs`
6. Shows alert with option to **Share** the file via `react-native-share`

**Key Dependencies:** `Card`, `Colours`, FontAwesome icons (including `faFileExcel`, `faChartBar`, `faCalendarDays`, `faGraduationCap`), Redux, `react-native-fs` (RNFS), `react-native-share` (Share), `DatePicker`, `SafeAreaView`

---

## State Management (Redux)

Managed via **Redux Toolkit** with 4 slices:

### Store Configuration (`src/app/store.js`)

```javascript
configureStore({
    reducer: {
        auth: authReducer,
        scanner: scannerReducer,
        profile: profileReducer,
        home: homeReducer,
    },
});
```

---

### Auth Slice (`src/features/auth/authSlice.js`)

| State Field | Type     | Default | Description                 |
| ----------- | -------- | ------- | --------------------------- |
| `token`     | `string` | `null`  | JWT access token            |
| `loading`   | `bool`   | `false` | Login request in progress   |
| `error`     | `string` | `null`  | Error message               |

**Async Thunks:**

| Thunk                  | API Call            | Description                                |
| ---------------------- | ------------------- | ------------------------------------------ |
| `loginUser`            | `POST /api/login`   | Authenticates user, stores token in AsyncStorage |
| `loadTokenFromStorage` | —                   | Reads token from AsyncStorage on app launch |

**Reducers:**

| Action   | Description                                      |
| -------- | ------------------------------------------------ |
| `setToken` | Manually set token (also persists to AsyncStorage) |
| `logout` | Clears token from state and wipes AsyncStorage   |

---

### Home Slice (`src/features/home/homeSlice.js`)

| State Field | Type    | Default | Description              |
| ----------- | ------- | ------- | ------------------------ |
| `data`      | `array` | `null`  | Attendance records array |
| `loading`   | `bool`  | `false` | Fetch in progress        |
| `error`     | `any`   | `null`  | Error payload            |

**Async Thunks:**

| Thunk             | API Call                   | Description                        |
| ----------------- | -------------------------- | ---------------------------------- |
| `fetchAttendance` | `POST /api/list-attendance`| Fetches attendance records by date |

**Reducers:**

| Action             | Description                                    |
| ------------------ | ---------------------------------------------- |
| `AddAttendance`    | Replaces the entire attendance data array      |
| `updateAttendance` | Updates a single record by `id`                |
| `clearAttendance`  | Resets data, loading, and error to initial      |

---

### Scanner Slice (`src/features/scanner/scannerSlice.js`)

| State Field    | Type     | Default | Description                       |
| -------------- | -------- | ------- | --------------------------------- |
| `lastScanned`  | `string` | `null`  | Last scanned barcode value        |
| `ScanResponse` | `object` | `null`  | API response after sending scan   |
| `loading`      | `bool`   | `false` | Request in progress               |
| `error`        | `object` | `null`  | Error payload (status + message)  |

**Async Thunks:**

| Thunk            | API Call                      | Description                        |
| ---------------- | ----------------------------- | ---------------------------------- |
| `sendAttendance` | `POST /api/attendance/{id}`   | Marks attendance for scanned ID    |

**Reducers:**

| Action          | Description                        |
| --------------- | ---------------------------------- |
| `setScannedData`| Stores the raw barcode value       |

**Extra:** Listens for the `logout` action from authSlice to reset all scanner state.

---

### Profile Slice (`src/features/profile/profileSlice.js`)

| State Field  | Type     | Default | Description          |
| ------------ | -------- | ------- | -------------------- |
| `userId`     | `string` | `null`  | User's unique ID     |
| `name`       | `string` | `null`  | Full name            |
| `username`   | `string` | `null`  | Login username       |
| `email`      | `string` | `null`  | Email address        |
| `phone`      | `string` | `null`  | Phone number         |
| `role`       | `string` | `null`  | Role identifier (`'1'` = User, `'2'` = Teacher/Admin) |
| `loading`    | `bool`   | `false` | Fetch in progress    |
| `error`      | `string` | `null`  | Error message        |

**Async Thunks:**

| Thunk          | API Call           | Description            |
| -------------- | ------------------ | ---------------------- |
| `fetchProfile` | `GET /api/profile` | Fetches logged-in user's profile |

**Reducers:**

| Action       | Description                            |
| ------------ | -------------------------------------- |
| `addProfile` | Manually set profile fields from payload |

---

## API Endpoints

All requests go to `BASE_URL` (set via `.env`). Authenticated endpoints use `Bearer <token>` in the `Authorization` header.

| Method | Endpoint                 | Auth Required | Body                          | Response                              | Used In       |
| ------ | ------------------------ | ------------- | ----------------------------- | ------------------------------------- | ------------- |
| POST   | `/api/login`             | ❌            | `{ username, password }`      | `{ data: { access_token } }`         | `authSlice`   |
| GET    | `/api/profile`           | ✅            | —                             | `{ data: { userId, name, username, email, phone, role } }` | `profileSlice` |
| POST   | `/api/list-attendance`   | ✅            | `{ date: "YYYY-MM-DD" }`     | `{ data: [ { id, Name, Course, inTime, outTime, ... } ] }` | `homeSlice`   |
| POST   | `/api/attendance/{id}`   | ✅            | `{}`                          | `{ meta: { code, message }, data: { Name, ... } }` | `scannerSlice` |

---

## Reusable Components

### Button (`src/components/Button.js`)

A multi-variant touchable button.

| Prop         | Type     | Default     | Description                               |
| ------------ | -------- | ----------- | ----------------------------------------- |
| `title`      | string   | —           | Button label text                         |
| `type`       | string   | `"primary"` | Variant: `"primary"`, `"secondary"`, `"outline"` |
| `onPress`    | func     | —           | Press handler                             |
| `disabled`   | bool     | `false`     | Disables interaction & reduces opacity    |
| `style`      | object   | —           | Additional container styles               |
| `textStyle`  | object   | —           | Additional text styles                    |

### Card (`src/components/Card.js`)

A shadowed card container with optional touchable behavior.

| Prop         | Type   | Default | Description                             |
| ------------ | ------ | ------- | --------------------------------------- |
| `children`   | node   | —       | Card content                            |
| `style`      | object | —       | Additional styles                       |
| `testID`     | string | —       | Test identifier                         |
| `isTouchable`| bool   | —       | Renders as `TouchableOpacity` if true   |

### Input (`src/components/Input.js`)

A styled text input wrapped in a bordered container. Passes all props through to the underlying `TextInput`.

### UserView (`src/components/UserView.js`)

The student/user dashboard view component. Self-contained with its own state management for date picking, sync, and attendance list rendering. See [Role-Based Views → UserView](#userview-srccomponentsUserViewjs) for full details.

### TeacherView (`src/components/TeacherView.js`)

The teacher/admin dashboard view component. Includes `StatCard` and `ReportRow` sub-components, CSV export logic, attendance rate calculation, and enhanced UI. See [Role-Based Views → TeacherView](#teacherview-srccomponentsTeacherViewjs) for full details.

---

## Theme System

### Colours (`src/theme/Colours.js`)

```javascript
{
    brand: {
        primary:      "#1E4FA8",   // Deep blue
        primaryDark:  "#0F2F63",   // Darker blue
        primaryLight: "#3C7BE0",   // Light blue
        accent:       "#5EA0FF",   // Sky blue accent
    },
    background: {
        main: "#F5F7FB",           // Light grey page background
        card: "#FFFFFF",           // White card background
    },
    text: {
        primary:   "#0F172A",      // Near-black
        secondary: "#475569",      // Medium grey
        muted:     "#94A3B8",      // Light grey
        white:     "#FFFFFF",      // White
    },
    border: {
        light:   "#E6ECF5",
        default: "#D9E1EF",
    },
    status: {
        success: "#22C55E",        // Green
        warning: "#F59E0B",        // Amber
        error:   "#EF4444",        // Red
    }
}
```

### Typography (`src/theme/Typo.js`)

| Style     | Font Size | Font Weight |
| --------- | --------- | ----------- |
| `title`   | 24        | 700 (Bold)  |
| `heading` | 20        | 600 (Semi)  |
| `body`    | 16        | 400 (Normal)|
| `caption` | 13        | 400 (Normal)|

### Spacing (`src/theme/Spacing.js`)

| Token | Value |
| ----- | ----- |
| `xs`  | 4px   |
| `sm`  | 8px   |
| `md`  | 16px  |
| `lg`  | 24px  |
| `xl`  | 32px  |

---

## Assets

| File                | Type | Usage                                  |
| ------------------- | ---- | -------------------------------------- |
| `Campuss_Icon.png`  | PNG  | App icon (255 KB)                      |
| `Campuss Icon.ico`  | ICO  | App icon for Windows/web               |
| `enter_pass.png`    | PNG  | Illustration on LoginScreen            |
| `Vector.png`        | PNG  | Decorative vector image                |
| `login_vector.svg`  | SVG  | Login page vector (not currently used) |

---

## Key Libraries

| Library                              | Version | Purpose                                        |
| ------------------------------------ | ------- | ---------------------------------------------- |
| `react-native`                       | 0.84.1  | Core framework                                 |
| `react`                              | 19.2.3  | UI library                                     |
| `@reduxjs/toolkit`                   | 2.11.2  | Redux state management                         |
| `react-redux`                        | 9.2.0   | React bindings for Redux                       |
| `@react-navigation/native`          | 7.1.32  | Navigation core                                |
| `@react-navigation/bottom-tabs`     | 7.15.4  | Bottom tab navigator                           |
| `react-native-vision-camera`        | 4.7.3   | Camera & barcode scanning                      |
| `react-native-reanimated`           | 4.2.2   | High-performance animations                    |
| `react-native-worklets`             | 0.7.4   | Worklet threading for vision-camera            |
| `axios`                             | 1.13.6  | HTTP client                                    |
| `@react-native-async-storage/async-storage` | 1.21.0 | Persistent key-value storage           |
| `react-native-config`               | 1.6.1   | Environment variable management                |
| `react-native-date-picker`          | 5.0.13  | Native date picker modal                       |
| `react-native-fs`                   | 2.20.0  | File system access (CSV export to Downloads)   |
| `react-native-share`                | 12.3.1  | Native share sheet (share exported reports)    |
| `react-native-gesture-handler`      | 2.30.0  | Gesture system for navigation                  |
| `react-native-safe-area-context`    | 5.7.0   | Safe area insets                               |
| `react-native-screens`              | 4.24.0  | Native screen containers                       |
| `react-native-svg`                  | 15.15.3 | SVG rendering                                  |
| `@fortawesome/react-native-fontawesome` | 0.3.2 | FontAwesome icon components                  |
| `@fortawesome/free-solid-svg-icons` | 7.2.0   | Solid icon pack                                |

---

## Babel & Metro Configuration

### Babel (`babel.config.js`)
- Preset: `module:@react-native/babel-preset`
- Plugin: `react-native-reanimated/plugin` (must be listed last)

### Metro (`metro.config.js`)
- Uses default React Native Metro config
- No custom transformations or module resolution

---

## Scope of Work

### Completed Features ✅

#### 1. Authentication System
- JWT-based login with username & password
- Token persistence via AsyncStorage (survives app restart)
- Auto-restore session on app launch
- Secure logout (clears Redux state + AsyncStorage)
- Error handling for invalid credentials

#### 2. Role-Based Dashboard Architecture
- `HomeScreen` acts as a role-based router/controller
- Detects user role from profile API response (`role` field)
- **Role 1 (User/Student)** → `UserView` component
- **Role 2 (Teacher/Admin)** → `TeacherView` component
- Clean separation — data fetching in `HomeScreen`, presentation in view components

#### 3. User/Student Dashboard (UserView)
- Institution header with greeting and role pill
- 4-stat card row (Total, IN, OUT, Absent) with live counts
- Scrollable attendance list with avatar initials, name, course, status pills, and time
- Color-coded status indicators (green/amber/red)
- Date filter via native date picker modal
- Sync FAB to refresh today's data

#### 4. Teacher/Admin Dashboard (TeacherView)
- Dark-themed header card with attendance rate progress bar
- 2×2 stats grid with colored icon backgrounds
- Enhanced report list with graduation cap course icons
- Color-coded avatars based on attendance status
- Empty state UI when no data is available
- Date filter with calendar icon
- Sync FAB with dark theme matching the header

#### 5. CSV/Excel Export (Teacher Only)
- Generates CSV with headers: Name, Course, Status, In Time, Out Time
- Proper CSV escaping for special characters (commas, quotes, newlines)
- Storage permission handling (Android < 13 vs scoped storage)
- Saves to device Downloads directory
- Post-download alert with Share option via native share sheet
- Error handling for permission denial and write failures

#### 6. Barcode Scanner
- Full-screen camera using `react-native-vision-camera` v4
- Supports 10 barcode formats (EAN-13, QR, Code-128, etc.)
- Auto-focus detection with immediate API dispatch
- Navigation back to Home after successful scan
- Alert feedback for success (student name) and error (404 / other)
- Smart camera lifecycle (pauses when: tab unfocused, app backgrounded, scan completed)

#### 7. User Profile
- Avatar section with icon, name, email, and role pill
- Account info card with 4 detail rows (name, email, role, employee ID)
- Color-coded icon backgrounds for each detail row
- Logout button with confirmation

#### 8. Custom Animated Navigation
- Custom bottom tab bar with SVG shapes
- Animated sliding indicator bar
- Animated floating icon button following active tab
- SVG bump shape animation behind active tab
- Spring-based animations for smooth transitions

---

### Planned / Future Features 🔜

#### 9. Student Registration / Sign-Up
- **Scope:** Add a registration flow accessible from the login screen's "Sign up" link (currently a placeholder). Should support new student self-registration with fields: name, email, username, password, course, and barcode ID. Backend API endpoint TBD.

#### 10. Preferences / Settings Screen
- **Scope:** The `ProfileScreen` has commented-out code for a "Preferences" settings card with `Notifications` and `Settings` rows. Implement a functional settings screen with notification preferences, theme toggle (dark/light), and app version info.

#### 11. Offline Mode & Data Caching
- **Scope:** Cache attendance data locally so the app functions without network connectivity. Queue scanned attendance entries and sync them when the connection is restored. Use AsyncStorage or SQLite for local persistence.

#### 12. Multi-Date Range Reports (Teacher)
- **Scope:** Extend the TeacherView filter to support date range selection (start date → end date) instead of single-date filtering. Aggregate stats across the range and export the combined report.

#### 13. Push Notifications
- **Scope:** Integrate push notifications (via Firebase Cloud Messaging or similar) to alert teachers when attendance falls below a threshold, or notify students of their attendance status.

#### 14. Role-Based Profile Enhancements
- **Scope:** Display role-specific information on the ProfileScreen — e.g., for teachers: classes assigned, total students; for students: attendance percentage, course details.

#### 15. Attendance History / Analytics
- **Scope:** Add a dedicated analytics screen with charts (bar/pie) showing attendance trends over time — weekly, monthly summaries. Use a charting library like `react-native-chart-kit` or `victory-native`.

#### 16. QR Code Generation for Students
- **Scope:** Allow admins to generate and print QR codes or barcodes for students directly from the app or a companion web portal.

---

*Last updated: June 2026*
