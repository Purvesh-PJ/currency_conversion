# Working Flow

This document describes the end-to-end flows in CurrencyX, from user action to final result.

---

## Main User Flow: Currency Conversion

### Step-by-Step Flow

```
1. User opens app
   ↓
2. Browser loads React app
   ↓
3. React Router renders HomePage (/)
   ↓
4. HomePage renders CurrencyConverter component
   ↓
5. User sees form with default values (USD → EUR)
   ↓
6. User enters amount (e.g., 100)
   ↓
7. User selects source currency (e.g., USD)
   ↓
8. User selects target currency (e.g., INR)
   ↓
9. User clicks "Convert" button
   ↓
10. Form submit event triggers handleConvert()
    ↓
11. Component calls getExchangeRate(fromCurrency, toCurrency)
    ↓
12. Service layer makes HTTP GET request via Axios
    ↓
13. Request sent to: https://v6.exchangerate-api.com/v6/{API_KEY}/latest/USD
    ↓
14. ExchangeRate-API processes request
    ↓
15. API returns JSON with conversion_rates object
    ↓
16. Service extracts rate for target currency (e.g., INR: 83.45)
    ↓
17. Service returns rate to component
    ↓
18. Component calculates: amount × rate (100 × 83.45 = 8345)
    ↓
19. Component updates convertedAmount state
    ↓
20. React re-renders component
    ↓
21. Result displayed: "100 USD = 8345.00 INR"
```

---

## Detailed Request-Response Flow

### API Call Sequence

```
CurrencyConverter Component
         │
         │ handleConvert(e)
         │ e.preventDefault()
         │
         ▼
    getExchangeRate(fromCurrency, toCurrency)
         │
         │ (in currencyService.js)
         │
         ▼
    axios.get(`${BASE_URL}/latest/${fromCurrency}`)
         │
         │ HTTP GET Request
         │
         ▼
┌────────────────────────────────────┐
│   ExchangeRate-API Server         │
│   Endpoint: /v6/{key}/latest/USD   │
└────────────────────────────────────┘
         │
         │ HTTP 200 OK
         │
         ▼
    Response JSON:
    {
      "result": "success",
      "base_code": "USD",
      "conversion_rates": {
        "EUR": 0.92,
        "INR": 83.45,
        "GBP": 0.79,
        ...
      }
    }
         │
         ▼
    Extract: response.data.conversion_rates[toCurrency]
         │
         ▼
    Return rate (e.g., 83.45)
         │
         ▼
    Component receives rate
         │
         ▼
    Calculate: (amount × rate).toFixed(2)
         │
         ▼
    setConvertedAmount("8345.00")
         │
         ▼
    React re-renders with result
```

---

## Currency Swap Flow

```
User clicks swap icon (⇅)
         │
         ▼
    handleSwap() triggered
         │
         ▼
    Swap state values:
    - fromCurrency ↔ toCurrency
    - USD ↔ EUR becomes EUR ↔ USD
         │
         ▼
    Clear previous result:
    - setConvertedAmount(null)
         │
         ▼
    React re-renders with swapped currencies
         │
         ▼
    User sees updated form
```

---

## Error Handling Flow

### Scenario 1: API Request Fails

```
User submits form
         │
         ▼
    API request sent
         │
         ▼
    Network error / API down
         │
         ▼
    Axios throws error
         │
         ▼
    catch block in getExchangeRate()
         │
         ▼
    throw new Error('Failed to fetch exchange rate...')
         │
         ▼
    catch block in handleConvert()
         │
         ▼
    alert(error.message)
         │
         ▼
    User sees browser alert with error message
```

### Scenario 2: Currency Not Found

```
API returns success but target currency missing
         │
         ▼
    response.data.conversion_rates[toCurrency] is undefined
         │
         ▼
    throw new Error(`Conversion rate for ${toCurrency} not found.`)
         │
         ▼
    User sees alert
```

---

## Routing Flow

### Valid Route (/)

```
User navigates to http://localhost:3000/
         │
         ▼
    React Router matches path="/"
         │
         ▼
    Renders <HomePage />
         │
         ▼
    HomePage renders CurrencyConverter
         │
         ▼
    User sees full app
```

### Invalid Route (e.g., /about)

```
User navigates to http://localhost:3000/about
         │
         ▼
    React Router matches path="*"
         │
         ▼
    Renders <NotFoundPage />
         │
         ▼
    User sees "404 - Page Not Found"
         │
         ▼
    User clicks "Go Back to Home"
         │
         ▼
    React Router navigates to "/"
```

---

## Component Lifecycle Flow

### Initial Mount

```
App starts
         │
         ▼
    ReactDOM.createRoot()
         │
         ▼
    Render <AppRoutes />
         │
         ▼
    <Router> initializes
         │
         ▼
    Match route → <HomePage />
         │
         ▼
    HomePage renders
         │
         ▼
    CurrencyConverter mounts
         │
         ▼
    useState hooks initialize:
    - amount: ''
    - fromCurrency: 'USD'
    - toCurrency: 'EUR'
    - convertedAmount: null
         │
         ▼
    Component renders with default state
```

### State Update Flow

```
User types in amount field
         │
         ▼
    onChange event fires
         │
         ▼
    setAmount(e.target.value)
         │
         ▼
    React schedules re-render
         │
         ▼
    Component re-renders with new amount
         │
         ▼
    Input field shows updated value
```

---

## Data Flow Summary

```
User Input
    ↓
Component State (useState)
    ↓
Event Handler (handleConvert)
    ↓
Service Layer (currencyService.js)
    ↓
HTTP Request (Axios)
    ↓
External API (ExchangeRate-API)
    ↓
HTTP Response (JSON)
    ↓
Service Layer (extract rate)
    ↓
Component State Update (setConvertedAmount)
    ↓
React Re-render
    ↓
UI Update (display result)
```

---

## Key Observations

1. **Synchronous UI, Asynchronous API:** User interactions are instant, but API calls are async (await)
2. **No Loading State:** User doesn't see a spinner during API call (potential UX improvement)
3. **No Caching:** Every conversion makes a fresh API call, even for the same currency pair
4. **Error Handling via Alert:** Errors shown via browser alert (not ideal UX)
5. **State Reset on Swap:** Swapping currencies clears the previous result
