# Modules & Components

This document breaks down the folder structure, key files, and their roles in the CurrencyX application.

---

## Project Structure

```
client/
├── public/
│   ├── index.html              # HTML entry point
│   ├── robots.txt              # SEO crawler instructions
│   └── screenshots/            # App preview images
├── src/
│   ├── components/             # Reusable UI components
│   │   └── CurrencyConverter.js
│   ├── pages/                  # Route-level page components
│   │   ├── HomePage.js
│   │   └── 404NotFound.js
│   ├── services/               # API integration layer
│   │   └── currencyService.js
│   ├── AppRoutes.js            # Route configuration
│   ├── index.js                # React app entry point
│   └── index.css               # Global CSS reset
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

---

## Module Breakdown

### 1. Entry Point

#### `src/index.js`
**Purpose:** Bootstrap the React application

**What it does:**
- Creates React root using `ReactDOM.createRoot()`
- Renders `<AppRoutes />` inside `<React.StrictMode>`
- Mounts app to `#root` div in `public/index.html`

**Why it exists:**
- Required entry point for Create React App
- Initializes React rendering pipeline

**Connections:**
- Imports `AppRoutes.js` (routing layer)
- Imports `index.css` (global styles)

---

### 2. Routing Layer

#### `src/AppRoutes.js`
**Purpose:** Define client-side routes

**What it does:**
- Wraps app in `<BrowserRouter>`
- Maps URL paths to page components
- Handles 404 fallback with wildcard route

**Routes:**
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Main landing page |
| `*` | `NotFoundPage` | Catch-all 404 page |

**Why it exists:**
- Centralized route configuration
- Enables client-side navigation without page reloads

**Connections:**
- Imported by `index.js`
- Imports page components from `pages/`

---

### 3. Pages (Route Components)

#### `src/pages/HomePage.js`
**Purpose:** Main landing page with hero section and converter

**What it does:**
- Renders full-page layout with gradient background
- Displays header with logo
- Shows hero section with tagline and features
- Embeds `<CurrencyConverter />` component
- Includes footer

**Styling:**
- Uses Styled Components for all styles
- Responsive design (mobile-first, desktop breakpoints)
- Glassmorphism aesthetic with gradient backgrounds

**Why it exists:**
- Primary user-facing page
- Provides context and branding around the converter

**Connections:**
- Imports `CurrencyConverter.js`
- Rendered by `AppRoutes.js` on `/` path

---

#### `src/pages/404NotFound.js`
**Purpose:** Fallback page for invalid routes

**What it does:**
- Displays "404 - Page Not Found" message
- Provides link back to home page

**Why it exists:**
- Handles navigation errors gracefully
- Prevents blank screen on invalid URLs

**Connections:**
- Rendered by `AppRoutes.js` on `*` path
- Uses React Router's `<Link>` component

**Note:** Currently unstyled (uses plain HTML). Could benefit from styled-components treatment.

---

### 4. Components (Reusable UI)

#### `src/components/CurrencyConverter.js`
**Purpose:** Core currency conversion form and logic

**What it does:**
- Renders conversion form with:
  - Amount input field
  - Source currency dropdown
  - Target currency dropdown
  - Swap button (⇅)
  - Convert button
  - Result display (conditional)
- Manages component state (amount, currencies, result)
- Handles form submission
- Calls API via `currencyService.js`
- Displays conversion result

**State Management:**
```javascript
const [amount, setAmount] = useState('');
const [fromCurrency, setFromCurrency] = useState('USD');
const [toCurrency, setToCurrency] = useState('EUR');
const [convertedAmount, setConvertedAmount] = useState(null);
```

**Key Functions:**
- `handleConvert(e)` - Form submission, API call, result calculation
- `handleSwap()` - Swap source and target currencies

**Supported Currencies:**
- 33 currencies hardcoded in `supportedCurrencies` array
- Includes major currencies (USD, EUR, GBP, INR, JPY, etc.)

**Styling:**
- Heavily styled with Styled Components
- Glassmorphism card design
- Gradient accents
- Responsive inputs and buttons
- Focus states and transitions

**Why it exists:**
- Encapsulates all conversion logic in one component
- Reusable (could be embedded in other pages)

**Connections:**
- Imports `getExchangeRate` from `services/currencyService.js`
- Imported by `HomePage.js`

---

### 5. Services (API Layer)

#### `src/services/currencyService.js`
**Purpose:** Encapsulate API communication with ExchangeRate-API

**What it does:**
- Exports `getExchangeRate(fromCurrency, toCurrency)` function
- Makes HTTP GET request to ExchangeRate-API
- Extracts conversion rate from response
- Handles errors and throws user-friendly messages

**API Details:**
- **Base URL:** `https://v6.exchangerate-api.com/v6/{API_KEY}`
- **Endpoint:** `/latest/{BASE_CURRENCY}`
- **Method:** GET
- **Response Format:** JSON with `conversion_rates` object

**Error Handling:**
- Network errors → "Failed to fetch exchange rate. Please try again later."
- Missing currency → "Conversion rate for {currency} not found."

**Why it exists:**
- Separation of concerns (API logic separate from UI)
- Reusable across multiple components
- Easier to test and mock

**Connections:**
- Imported by `CurrencyConverter.js`
- Uses Axios for HTTP requests

**Security Note:**
- API key is hardcoded (should use environment variables)

---

### 6. Styling

#### `src/index.css`
**Purpose:** Global CSS reset and base styles

**What it does:**
- Resets default browser margins
- Sets base font family
- Enables font smoothing

**Why it exists:**
- Provides consistent baseline across browsers
- Minimal global styles (most styling is component-scoped)

**Connections:**
- Imported by `index.js`

---

#### Styled Components (CSS-in-JS)
**Used in:** `HomePage.js`, `CurrencyConverter.js`

**Approach:**
- Component-scoped styles
- Dynamic styling based on props/state
- No CSS class name collisions
- Easier to maintain and refactor

**Design System:**
- **Colors:** Purple gradient (`#667eea`, `#764ba2`, `#f093fb`)
- **Typography:** Segoe UI, sans-serif fallbacks
- **Effects:** Glassmorphism, shadows, gradients
- **Interactions:** Hover states, transitions, focus rings

---

## Configuration Files

### `package.json`
**Purpose:** Project metadata and dependencies

**Key Dependencies:**
- `react` (18.3.1) - Core library
- `react-dom` (18.3.1) - DOM rendering
- `react-router-dom` (7.0.1) - Routing
- `styled-components` (6.1.13) - CSS-in-JS
- `axios` (1.7.8) - HTTP client
- `react-scripts` (5.0.1) - Build tooling (Create React App)

**Scripts:**
- `npm start` - Development server (port 3000)
- `npm run build` - Production build
- `npm test` - Run tests (not implemented)

---

### `public/index.html`
**Purpose:** HTML shell for React app

**What it does:**
- Provides `<div id="root"></div>` mount point
- Includes meta tags for SEO and responsiveness
- Sets page title

---

## Module Connections Diagram

```
index.js
    │
    └─→ AppRoutes.js
            │
            ├─→ HomePage.js
            │       │
            │       └─→ CurrencyConverter.js
            │               │
            │               └─→ currencyService.js
            │                       │
            │                       └─→ Axios → ExchangeRate-API
            │
            └─→ 404NotFound.js
```

---

## Important Entry Points

1. **User Entry:** `public/index.html` → `src/index.js`
2. **Routing Entry:** `src/AppRoutes.js`
3. **Main Page:** `src/pages/HomePage.js`
4. **Core Logic:** `src/components/CurrencyConverter.js`
5. **API Integration:** `src/services/currencyService.js`

---

## Configuration Points

1. **API Key:** `src/services/currencyService.js` (line 4)
2. **Supported Currencies:** `src/components/CurrencyConverter.js` (lines 95-127)
3. **Routes:** `src/AppRoutes.js`
4. **Global Styles:** `src/index.css`

---

## Utility Areas

Currently, there are no dedicated utility folders. Potential additions:
- `src/utils/` - Helper functions (e.g., number formatting)
- `src/constants/` - Shared constants (e.g., currency list)
- `src/hooks/` - Custom React hooks (e.g., `useCurrencyConverter`)
