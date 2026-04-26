# Fintech Personal Finance Overview

A mobile-first personal finance dashboard built with **Expo SDK 54** and **React Native**. Part of the [LLM PoC Research](../../README.md) project exploring how LLMs accelerate Proof of Concept development.

## Features

### 🏠 Home Dashboard
- Personalized greeting with authenticated user
- Monthly budget card with progress bar
- Quick action buttons (Add Expense, Income, Transfer, Reports)
- Spending breakdown by category with emoji icons
- Recent transactions list

### 📊 Statistics
- **Pie chart** visualization of spending by category (react-native-chart-kit)
- **Time period selector** — Week, Month, 3 Months, 6 Months
- **Currency switcher** — USD, EUR, BYN with real-time conversion
- **Budget tracking** — budget scales proportionally to selected period
- **Export to PDF/CSV** — generates formatted reports with all filters applied

### 🏷️ Deals & Discounts
- Linked credit cards carousel (Visa, Mastercard, Amex)
- Store discount cards with category filters (Grocery, Dining, Fuel, Shopping, Travel)
- 10 sample offers with discount badges

### 🔐 Authentication
- Fake auth badge in header with user avatar and name
- Dropdown menu on tap with user email and theme settings

### 🌙 Theme Support
- Light, Dark, and System theme modes
- Toggle from user profile dropdown
- All screens fully support both themes

## Tech Stack

- **Expo SDK 54** with file-based routing (expo-router)
- **React Native 0.81** + React 19
- **react-native-chart-kit** — Pie chart visualization
- **expo-print** / **expo-sharing** / **expo-file-system** — PDF/CSV export
- **TypeScript 5.9**

## Project Structure

```
app/
  _layout.tsx              # Root layout (providers: Theme, Auth, Currency)
  (tabs)/
    _layout.tsx            # Tab navigator + AuthBadge with theme dropdown
    index.tsx              # Home dashboard
    statistics.tsx         # Statistics with charts, filters, export
    explore.tsx            # Deals & discount cards
data/
  categories.ts            # Spending categories with colors and icons
  currencies.ts            # Currency definitions, conversion, formatting
  transactions.ts          # Seeded transaction generator (6 months of data)
hooks/
  use-auth.tsx             # Fake auth context (user profile)
  use-currency.tsx         # Currency context (convert, format, switch)
  use-theme-mode.tsx       # Theme context (light/dark/system)
  use-theme-mode-bridge.ts # Bridge for useColorScheme compatibility
  use-time-period.ts       # Time period filter + category aggregation
  use-color-scheme.ts      # Re-exports resolved color scheme
  use-theme-color.ts       # Theme color helper
utils/
  export.ts                # PDF/CSV generation and sharing
components/
  haptic-tab.tsx           # Tab bar button with haptic feedback
  themed-text.tsx          # Theme-aware Text component
  themed-view.tsx          # Theme-aware View component
  ui/
    icon-symbol.tsx        # SF Symbol icon wrapper
```

## Getting Started

```bash
npm install
```

### Run

```bash
make start       # Expo dev server (scan QR with Expo Go)
make web         # Run in browser
make android     # Run on Android (requires Android SDK)
make ios         # Run on iOS (requires macOS + Xcode)
```

### Validate

```bash
make typecheck   # TypeScript check
make lint        # ESLint
```

## Available Make Targets

| Target      | Description                          |
|-------------|--------------------------------------|
| `start`     | Start Expo dev server                |
| `web`       | Start for web platform               |
| `android`   | Start for Android                    |
| `ios`       | Start for iOS                        |
| `install`   | Install dependencies                 |
| `lint`      | Run ESLint                           |
| `typecheck` | Run TypeScript type checking         |
| `clean`     | Remove build artifacts and caches    |
| `help`      | Show available targets               |
