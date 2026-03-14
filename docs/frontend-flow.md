# Frontend Flow

This document explains the React frontend architecture, component structure, state management, routing, and UI logic.

---

## Component Hierarchy

```
<React.StrictMode>
    │
    └─→ <AppRoutes>
            │
            └─→ <BrowserRouter>
                    │
                    └─→ <Routes>
                            │
                            ├─→ Route path="/"
                            │       │
                            │       └─→ <HomePage>
                            │               │
                            │               ├─→ <Header>
                            │               ├─→ <HeroSection>
                            │               ├─→ <CurrencyConverter>
                            │               │       │
                            │               │       ├─→ <Form>
                            │               │       │       │
                            │               │       │       ├─→ <Input> (amount)
                            │               │       │       ├─→ <Select> (from)
                            │               │       │       ├─→ <SwapIcon>
                            │               │       │       ├─→ <Select> (to)
                            │               │       │       └─→ <Button> (submit)
                            │               │       │
                            │               │       └─→ <Result> (conditional)
                            │               │
                            │               └─→ <Footer>
                            │
                            └─→ Route path="*"
                                    │
                                    └─→ <NotFoundPage>
```

---

## Component Structure

### 1. AppRoutes (Router Component)

**Type:** Functional component (no state)

**Responsibility:** Route configuration

**Structure:**
```javascript
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
```

**Key Points:**
- Uses `BrowserRouter` (HTML5 History API)
- Declarative route matching
- Wildcard route for 404 handling

---

### 2. HomePage (Page Component)

**Type:** Functional component (no state)

**Responsibility:** Layout and presentation

**Structure:**
- Header (logo)
- Main section (hero + converter)
- Footer (copyright)

**Styling Approach:**
- All styles defined as Styled Components
- Responsive design with media queries
- Gradient background covering full viewport

**Layout Strategy:**
```
Mobile (< 992px):
┌─────────────────┐
│     Header      │
├─────────────────┤
│   Hero Text     │
│   Features      │
├─────────────────┤
│   Converter     │
├─────────────────┤
│     Footer      │
└─────────────────┘

Desktop (≥ 992px):
┌─────────────────────────────────┐
│            Header               │
├─────────────────────────────────┤
│  Hero Text  │    Converter      │
│  Features   │                   │
├─────────────────────────────────┤
│            Footer               │
└─────────────────────────────────┘
```

**Props Flow:**
- No props passed to HomePage
- HomePage passes no props to CurrencyConverter (self-contained)

---

### 3. CurrencyConverter (Smart Component)

**Type:** Functional component with state

**Responsibility:** Conversion logic and UI

**State Management:**
```javascript
const [amount, setAmount] = useState('');
const [fromCurrency, setFromCurrency] = useState('USD');
const [toCurrency, setToCurrency] = useState('EUR');
const [convertedAmount, setConvertedAmount] = useState(null);
```

**State Explanation:**
| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| `amount` | string | `''` | User input amount |
| `fromCurrency` | string | `'USD'` | Source currency code |
| `toCurrency` | string | `'EUR'` | Target currency code |
| `convertedAmount` | string\|null | `null` | Calculated result |

**Event Handlers:**

#### `handleConvert(e)`
```javascript
const handleConvert = async (e) => {
  e.preventDefault();
  try {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    setConvertedAmount((amount * rate).toFixed(2));
  } catch (error) {
    alert(error.message);
  }
};
```
- Prevents default form submission
- Calls API service
- Calculates result (amount × rate)
- Formats to 2 decimal places
- Updates state → triggers re-render
- Shows alert on error

#### `handleSwap()`
```javascript
const handleSwap = () => {
  setFromCurrency(toCurrency);
  setToCurrency(fromCurrency);
  setConvertedAmount(null);
};
```
- Swaps currency values
- Clears previous result
- No API call (user must click Convert again)

**Form Structure:**
```javascript
<Form onSubmit={handleConvert}>
  <Input 
    type="number"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    required
  />
  <Select 
    value={fromCurrency}
    onChange={(e) => setFromCurrency(e.target.value)}
  >
    {supportedCurrencies.map(currency => (
      <option key={currency.code} value={currency.code}>
        {currency.code} - {currency.name}
      </option>
    ))}
  </Select>
  <SwapIcon onClick={handleSwap}>⇅</SwapIcon>
  <Select 
    value={toCurrency}
    onChange={(e) => setToCurrency(e.target.value)}
  >
    {/* Same options */}
  </Select>
  <Button type="submit">Convert</Button>
</Form>
```

**Conditional Rendering:**
```javascript
{convertedAmount && (
  <Result>
    <ResultLabel>Converted Amount</ResultLabel>
    <ResultValue>
      {amount} {fromCurrency} = {convertedAmount} {toCurrency}
    </ResultValue>
  </Result>
)}
```
- Result only shown when `convertedAmount` is truthy
- Hidden initially and after swap

---

### 4. NotFoundPage (Page Component)

**Type:** Functional component (no state)

**Responsibility:** 404 error handling

**Structure:**
```javascript
<div>
  <h1>404 - Page Not Found</h1>
  <Link to="/">Go Back to Home</Link>
</div>
```

**Note:** Currently unstyled (plain HTML)

---

## Routing Logic

### Client-Side Navigation

**How it works:**
1. User clicks link or enters URL
2. React Router intercepts navigation
3. Matches URL against route definitions
4. Renders corresponding component
5. No page reload (SPA behavior)

**Route Matching:**
```javascript
<Routes>
  <Route path="/" element={<HomePage />} />      // Exact match
  <Route path="*" element={<NotFoundPage />} />  // Catch-all
</Routes>
```

**Navigation Methods:**
- `<Link to="/">` - Declarative navigation
- `useNavigate()` hook - Programmatic navigation (not used in this app)
- Direct URL entry - Handled by React Router

---

## State Flow

### Local Component State (useState)

**Pattern:** Unidirectional data flow

```
User Input
    ↓
onChange Event
    ↓
setState Function
    ↓
State Update
    ↓
React Re-render
    ↓
UI Update
```

**Example: Amount Input**
```
User types "100"
    ↓
onChange={(e) => setAmount(e.target.value)}
    ↓
setAmount("100")
    ↓
amount state = "100"
    ↓
React re-renders component
    ↓
Input shows "100"
```

**No Global State:**
- No Redux, Context API, or other state management
- All state is local to CurrencyConverter
- State doesn't persist across page reloads

---

## Data Fetching

### Async API Calls

**Pattern:** async/await in event handler

```javascript
const handleConvert = async (e) => {
  e.preventDefault();
  try {
    const rate = await getExchangeRate(fromCurrency, toCurrency);
    // Use rate...
  } catch (error) {
    alert(error.message);
  }
};
```

**Flow:**
1. User submits form
2. `handleConvert` called
3. Async function pauses at `await`
4. API request sent (Axios)
5. Component waits for response
6. Response received → function resumes
7. State updated → UI re-renders

**No Loading State:**
- User doesn't see spinner during API call
- Form remains interactive (could submit multiple times)
- Potential UX improvement area

---

## Hooks Usage

### useState

**Purpose:** Manage component state

**Usage in CurrencyConverter:**
```javascript
const [amount, setAmount] = useState('');
const [fromCurrency, setFromCurrency] = useState('USD');
const [toCurrency, setToCurrency] = useState('EUR');
const [convertedAmount, setConvertedAmount] = useState(null);
```

**Pattern:**
- Destructure state value and setter function
- Initialize with default value
- Call setter to update state
- React handles re-rendering

**No Other Hooks Used:**
- No `useEffect` (no side effects on mount)
- No `useContext` (no global state)
- No `useRef` (no DOM manipulation)
- No `useMemo` or `useCallback` (no performance optimization)

---

## Forms Handling

### Controlled Components

**Pattern:** React controls form state

```javascript
<Input
  type="number"
  value={amount}                              // State controls value
  onChange={(e) => setAmount(e.target.value)} // Update state on change
  required
/>
```

**Benefits:**
- Single source of truth (React state)
- Easy validation
- Programmatic control (e.g., clear form)

**Form Submission:**
```javascript
<Form onSubmit={handleConvert}>
  {/* inputs */}
  <Button type="submit">Convert</Button>
</Form>
```

**Validation:**
- HTML5 validation (`required` attribute)
- No custom validation logic
- Browser handles empty field errors

---

## Conditional Rendering

### Result Display

**Pattern:** Logical AND operator

```javascript
{convertedAmount && (
  <Result>
    {/* content */}
  </Result>
)}
```

**Logic:**
- If `convertedAmount` is `null` → nothing rendered
- If `convertedAmount` is a string (e.g., "8345.00") → Result rendered

**Alternative Patterns (not used):**
- Ternary: `{convertedAmount ? <Result /> : null}`
- If-else: Separate variable assignment

---

## Reusable UI Logic

### Currency List Rendering

**Pattern:** Array.map()

```javascript
{supportedCurrencies.map(currency => (
  <option key={currency.code} value={currency.code}>
    {currency.code} - {currency.name}
  </option>
))}
```

**Key Points:**
- `key` prop required for list items (React optimization)
- Same logic used for both dropdowns
- Data-driven rendering (easy to add currencies)

---

## Styling Architecture

### Styled Components Pattern

**Definition:**
```javascript
const Button = styled.button`
  padding: 10px;
  font-size: 0.9rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* ... */
`;
```

**Usage:**
```javascript
<Button type="submit">Convert</Button>
```

**Benefits:**
- Component-scoped styles (no global conflicts)
- Dynamic styling based on props (not used here)
- Automatic vendor prefixing
- Dead code elimination (unused styles removed)

**Responsive Design:**
```javascript
const Main = styled.main`
  flex-direction: column;
  
  @media (min-width: 992px) {
    flex-direction: row;
  }
`;
```

---

## Performance Considerations

### Current State:
- No memoization (`useMemo`, `React.memo`)
- No code splitting (single bundle)
- No lazy loading
- No virtualization (not needed for small lists)

### Why it's okay:
- Small app with minimal components
- No expensive computations
- No large lists
- Fast enough for current use case

### Potential Optimizations:
- Memoize currency list
- Debounce API calls
- Cache API responses
- Add loading states

---

## Error Handling

### Current Approach:
```javascript
try {
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  setConvertedAmount((amount * rate).toFixed(2));
} catch (error) {
  alert(error.message);
}
```

**Issues:**
- Browser alert (poor UX)
- No error state in component
- No retry mechanism
- No error boundary

**Better Approach:**
```javascript
const [error, setError] = useState(null);

try {
  setError(null);
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  setConvertedAmount((amount * rate).toFixed(2));
} catch (error) {
  setError(error.message);
}

// In JSX:
{error && <ErrorMessage>{error}</ErrorMessage>}
```

---

## Key Takeaways

1. **Simple State Management:** Local state only, no global state needed
2. **Controlled Forms:** React controls all form inputs
3. **Async Handling:** async/await for API calls
4. **Conditional Rendering:** Show/hide result based on state
5. **Styled Components:** CSS-in-JS for component-scoped styles
6. **Client-Side Routing:** React Router for SPA navigation
7. **No Complex Patterns:** No HOCs, render props, or advanced hooks
