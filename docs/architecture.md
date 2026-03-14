# Architecture Overview

## System Type

CurrencyX is a **frontend-only single-page application (SPA)** built with React. It provides real-time currency conversion by consuming the ExchangeRate-API, a third-party REST API service.

There is no backend server, no database, and no authentication layer. The application runs entirely in the browser and communicates directly with an external API.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │           React Application (SPA)                 │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────┐  │  │
│  │  │   Pages     │  │  Components  │  │ Services │  │  │
│  │  │  HomePage   │  │  Currency    │  │ currency │  │  │
│  │  │  404Page    │  │  Converter   │  │ Service  │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────┘  │  │
│  │         │                │                 │      │  │
│  │         └────────────────┴─────────────────┘      │  │
│  │                          │                        │  │
│  │                   React Router                    │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│                     Axios HTTP                          │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  ExchangeRate-API      │
              │  (Third-Party Service) │
              └────────────────────────┘
```

---

## Major Layers

### 1. Presentation Layer (UI)
- **Technology:** React 18 + Styled Components
- **Responsibility:** Render UI, handle user input, display results
- **Key Files:**
  - `HomePage.js` - Main landing page with hero section
  - `CurrencyConverter.js` - Core conversion form component
  - `404NotFound.js` - Fallback route

### 2. Routing Layer
- **Technology:** React Router v7
- **Responsibility:** Client-side navigation
- **Key Files:**
  - `AppRoutes.js` - Route definitions
- **Routes:**
  - `/` → HomePage
  - `*` → 404 Page

### 3. Service Layer
- **Technology:** Axios
- **Responsibility:** API communication, data fetching, error handling
- **Key Files:**
  - `currencyService.js` - Encapsulates API calls to ExchangeRate-API

### 4. External Dependency
- **Service:** ExchangeRate-API (v6)
- **Endpoint:** `https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{BASE_CURRENCY}`
- **Purpose:** Provides real-time exchange rates for 30+ currencies

---

## Architecture for Beginners

Think of this app as a simple calculator that talks to the internet:

1. You open the app in your browser
2. You enter an amount and select currencies
3. The app asks a currency service on the internet: "What's the exchange rate?"
4. The service responds with the rate
5. The app calculates and shows you the result

Everything happens in your browser. There's no server you own—just React code running on your computer and talking to someone else's API.

---

## Architecture for Developers

This is a **client-side rendered (CSR) React SPA** with the following characteristics:

- **No backend:** Direct browser-to-API communication
- **Stateless:** No persistent storage; all state is ephemeral (component state only)
- **API-dependent:** Relies entirely on ExchangeRate-API availability
- **Component-based:** Modular UI with styled-components for CSS-in-JS
- **Routing:** Client-side routing via React Router (no server-side rendering)

**Data Flow:**
```
User Input → Component State → Service Layer → External API → Response → State Update → UI Re-render
```

**Styling Strategy:**
- Styled Components for component-scoped CSS
- Glassmorphism design pattern
- Responsive design with media queries
- Gradient backgrounds and modern UI aesthetics

---

## Confirmed vs. Assumptions

### Confirmed (from code):
- React 18.3 with functional components and hooks
- React Router v7 for routing
- Styled Components 6.1 for styling
- Axios for HTTP requests
- ExchangeRate-API v6 integration
- 33 supported currencies hardcoded in component
- No authentication or user accounts
- No backend server

### Assumptions:
- API key is exposed in client code (security concern—see improvements.md)
- API has rate limits (typical for free tier)
- No offline support or caching
- No error retry logic beyond basic try-catch

### Missing/Unclear:
- No test coverage visible
- No environment variable configuration for API key
- No loading states during API calls
- No rate limiting handling
- No analytics or monitoring
