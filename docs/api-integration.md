# API Integration

This document explains how CurrencyX integrates with the ExchangeRate-API, a third-party service for real-time currency exchange rates.

---

## External API Used

### ExchangeRate-API

**Service:** [ExchangeRate-API](https://www.exchangerate-api.com/)  
**Version:** v6  
**Pricing:** Free tier available (1,500 requests/month)  
**Documentation:** https://www.exchangerate-api.com/docs/overview

**Purpose:**
- Provides real-time exchange rates for 160+ currencies
- Updates rates daily (or more frequently on paid tiers)
- No authentication required beyond API key

---

## API Configuration

### Base URL

```javascript
const BASE_URL = 'https://v6.exchangerate-api.com/v6/f1e21331a568057f0485efc7';
```

**Location:** `client/src/services/currencyService.js`

**Structure:**
```
https://v6.exchangerate-api.com/v6/{API_KEY}
```

**Security Issue:**
- API key is hardcoded in client-side code
- Visible in browser DevTools and source code
- Should use environment variables (`.env` file)

**Recommended Fix:**
```javascript
// .env file
REACT_APP_EXCHANGE_API_KEY=f1e21331a568057f0485efc7

// currencyService.js
const BASE_URL = `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_API_KEY}`;
```

---

## API Endpoint Used

### Get Latest Exchange Rates

**Endpoint:** `/latest/{BASE_CURRENCY}`

**Full URL Example:**
```
https://v6.exchangerate-api.com/v6/f1e21331a568057f0485efc7/latest/USD
```

**Method:** GET

**Parameters:**
- `{BASE_CURRENCY}` - Three-letter currency code (e.g., USD, EUR, INR)

**Request Headers:**
- None required (API key in URL)

**Example Request:**
```javascript
axios.get(`${BASE_URL}/latest/USD`)
```

---

## API Response Format

### Success Response

**Status Code:** 200 OK

**Response Body:**
```json
{
  "result": "success",
  "documentation": "https://www.exchangerate-api.com/docs",
  "terms_of_use": "https://www.exchangerate-api.com/terms",
  "time_last_update_unix": 1704067201,
  "time_last_update_utc": "Mon, 01 Jan 2024 00:00:01 +0000",
  "time_next_update_unix": 1704153601,
  "time_next_update_utc": "Tue, 02 Jan 2024 00:00:01 +0000",
  "base_code": "USD",
  "conversion_rates": {
    "USD": 1,
    "EUR": 0.9234,
    "GBP": 0.7896,
    "INR": 83.4521,
    "JPY": 141.2345,
    "AUD": 1.4567,
    "CAD": 1.3456,
    "CHF": 0.8765,
    "CNY": 7.1234,
    "MXN": 17.8901,
    // ... 150+ more currencies
  }
}
```

**Key Fields:**
- `result` - "success" or "error"
- `base_code` - Base currency used (matches request)
- `conversion_rates` - Object with currency codes as keys, rates as values
- `time_last_update_utc` - When rates were last updated

---

### Error Response

**Status Code:** 400, 401, 403, 404, or 500

**Response Body:**
```json
{
  "result": "error",
  "error-type": "invalid-key"
}
```

**Common Error Types:**
- `invalid-key` - API key is incorrect
- `inactive-account` - Account suspended
- `quota-reached` - Monthly request limit exceeded
- `unsupported-code` - Invalid currency code

---

## Integration Implementation

### Service Layer Function

**Location:** `client/src/services/currencyService.js`

```javascript
export const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(`${BASE_URL}/latest/${fromCurrency}`);
    if (response.data && response.data.conversion_rates[toCurrency]) {
      return response.data.conversion_rates[toCurrency];
    } else {
      throw new Error(`Conversion rate for ${toCurrency} not found.`);
    }
  } catch (error) {
    console.error('Error:', error.response || error.message);
    throw new Error('Failed to fetch exchange rate. Please try again later.');
  }
};
```

**Function Signature:**
```typescript
getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>
```

**Parameters:**
- `fromCurrency` - Base currency code (e.g., "USD")
- `toCurrency` - Target currency code (e.g., "INR")

**Returns:**
- Promise that resolves to exchange rate (number)
- Example: `83.4521` (1 USD = 83.4521 INR)

**Throws:**
- Error with user-friendly message on failure

---

## Request Flow

### Step-by-Step

```
1. Component calls getExchangeRate("USD", "INR")
         ↓
2. Function constructs URL:
   https://v6.exchangerate-api.com/v6/{KEY}/latest/USD
         ↓
3. Axios sends HTTP GET request
         ↓
4. ExchangeRate-API server processes request
         ↓
5. Server returns JSON response
         ↓
6. Axios parses JSON automatically
         ↓
7. Function extracts: response.data.conversion_rates["INR"]
         ↓
8. Function returns: 83.4521
         ↓
9. Component receives rate and calculates result
```

---

## Data Transformation

### Raw API Data → Usable Rate

**API Response:**
```json
{
  "conversion_rates": {
    "INR": 83.4521,
    "EUR": 0.9234,
    // ...
  }
}
```

**Extraction:**
```javascript
const rate = response.data.conversion_rates[toCurrency];
// rate = 83.4521
```

**Usage in Component:**
```javascript
const convertedAmount = (amount * rate).toFixed(2);
// If amount = 100, convertedAmount = "8345.21"
```

**No Additional Transformation:**
- Rate used directly from API
- No rounding or adjustment
- Formatted to 2 decimals only for display

---

## Error Handling

### Network Errors

**Scenario:** API server down, no internet connection

**Axios Behavior:**
```javascript
catch (error) {
  // error.response is undefined
  // error.message = "Network Error"
}
```

**Handling:**
```javascript
console.error('Error:', error.response || error.message);
throw new Error('Failed to fetch exchange rate. Please try again later.');
```

**User Experience:**
- Browser alert with generic error message
- No retry mechanism
- No offline fallback

---

### API Errors

**Scenario:** Invalid API key, quota exceeded

**Axios Behavior:**
```javascript
catch (error) {
  // error.response.status = 401 or 403
  // error.response.data = { result: "error", error-type: "invalid-key" }
}
```

**Handling:**
- Same generic error message
- Doesn't expose API error details to user
- Logs to console for debugging

---

### Missing Currency

**Scenario:** Target currency not in response

**Check:**
```javascript
if (response.data && response.data.conversion_rates[toCurrency]) {
  return response.data.conversion_rates[toCurrency];
} else {
  throw new Error(`Conversion rate for ${toCurrency} not found.`);
}
```

**Note:** This should never happen with hardcoded currency list, but provides safety.

---

## Loading States

### Current Implementation

**No loading state:**
- User clicks "Convert"
- Button remains clickable
- No visual feedback during API call
- Result appears when ready

**Issues:**
- User might click multiple times
- No indication of progress
- Confusing if API is slow

---

### Recommended Implementation

```javascript
const [loading, setLoading] = useState(false);

const handleConvert = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    setConvertedAmount((amount * rate).toFixed(2));
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

// In JSX:
<Button type="submit" disabled={loading}>
  {loading ? 'Converting...' : 'Convert'}
</Button>
```

---

## Rate Limiting

### API Limits (Free Tier)

**Confirmed:**
- 1,500 requests per month
- No rate limit per second/minute

**Assumptions:**
- No caching on API side for same request
- Each conversion = 1 API call
- No batch endpoint available

**Current App Behavior:**
- Every "Convert" click = 1 API call
- No client-side caching
- Could exhaust quota quickly with heavy use

---

### Optimization Strategies

**1. Client-Side Caching:**
```javascript
const cache = {};

export const getExchangeRate = async (fromCurrency, toCurrency) => {
  const cacheKey = `${fromCurrency}_${toCurrency}`;
  
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  
  const response = await axios.get(`${BASE_URL}/latest/${fromCurrency}`);
  const rate = response.data.conversion_rates[toCurrency];
  
  cache[cacheKey] = rate;
  return rate;
};
```

**2. Debouncing:**
- Wait for user to stop typing before calling API
- Reduces unnecessary calls

**3. Batch Requests:**
- Fetch all rates once, store locally
- Use stored rates for conversions
- Refresh periodically

---

## Dependency Risk

### Single Point of Failure

**Risk:** App completely depends on ExchangeRate-API

**Failure Scenarios:**
1. API service down → App unusable
2. API key revoked → App breaks
3. Quota exceeded → App stops working
4. API changes format → App breaks

**Mitigation Strategies:**
1. **Fallback API:** Integrate secondary API (e.g., Fixer.io, CurrencyLayer)
2. **Cached Rates:** Store last successful rates, use if API fails
3. **Error Boundaries:** Graceful degradation
4. **Monitoring:** Alert on API failures

---

## Security Considerations

### API Key Exposure

**Current State:**
- API key visible in client code
- Anyone can copy and use it
- Could exhaust your quota

**Solutions:**
1. **Environment Variables:**
   ```bash
   # .env
   REACT_APP_EXCHANGE_API_KEY=your_key_here
   ```

2. **Backend Proxy:**
   ```
   Client → Your Backend → ExchangeRate-API
   ```
   - API key stored on server
   - Client calls your backend
   - Backend calls ExchangeRate-API

3. **Rate Limiting:**
   - Limit requests per user/IP
   - Prevent abuse

---

## API Response Caching

### Current State

**No caching:**
- Same conversion repeated = multiple API calls
- Wastes quota
- Slower user experience

**Browser Caching:**
- Axios doesn't cache by default
- API response headers might allow caching (not verified)

---

### Recommended Caching Strategy

**Time-Based Cache:**
```javascript
const cache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const getExchangeRate = async (fromCurrency, toCurrency) => {
  const cacheKey = `${fromCurrency}_${toCurrency}`;
  const cached = cache[cacheKey];
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.rate;
  }
  
  const response = await axios.get(`${BASE_URL}/latest/${fromCurrency}`);
  const rate = response.data.conversion_rates[toCurrency];
  
  cache[cacheKey] = {
    rate,
    timestamp: Date.now()
  };
  
  return rate;
};
```

**Benefits:**
- Reduces API calls
- Faster conversions
- Preserves quota
- Rates updated hourly (acceptable for most use cases)

---

## Testing API Integration

### Manual Testing

**Test Cases:**
1. Valid conversion (USD → INR)
2. Same currency (USD → USD)
3. Invalid API key
4. Network offline
5. Unsupported currency (shouldn't happen with dropdown)

**Current Testing:**
- No automated tests
- Manual testing only

---

### Recommended Test Approach

**Mock API Responses:**
```javascript
// __tests__/currencyService.test.js
import axios from 'axios';
import { getExchangeRate } from './currencyService';

jest.mock('axios');

test('returns exchange rate on success', async () => {
  axios.get.mockResolvedValue({
    data: {
      conversion_rates: { INR: 83.45 }
    }
  });
  
  const rate = await getExchangeRate('USD', 'INR');
  expect(rate).toBe(83.45);
});

test('throws error on API failure', async () => {
  axios.get.mockRejectedValue(new Error('Network Error'));
  
  await expect(getExchangeRate('USD', 'INR'))
    .rejects.toThrow('Failed to fetch exchange rate');
});
```

---

## Key Takeaways

1. **Single External Dependency:** ExchangeRate-API v6
2. **Simple Integration:** One function, one endpoint
3. **No Authentication:** API key in URL
4. **Security Risk:** API key exposed in client code
5. **No Caching:** Every conversion = API call
6. **No Loading State:** Poor UX during API call
7. **Basic Error Handling:** Generic error messages
8. **Rate Limit Risk:** 1,500 requests/month (free tier)
9. **No Fallback:** App breaks if API fails
10. **Easy to Improve:** Many optimization opportunities
