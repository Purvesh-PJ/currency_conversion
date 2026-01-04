# Currency Conversion

A React-based currency converter that fetches live exchange rates from
ExchangeRate-API and lets you convert between many supported currencies.

## Features

- Real-time exchange rates via a public API.
- Wide currency list with quick dropdown selection.
- Simple single-page UI with client-side routing.

## Tech Stack

- Frontend: React 18, React Router, Styled Components
- Data fetching: Axios
- Tooling: Create React App
- Backend: Node.js/Express dependencies are scaffolded in `server/` (no server
  runtime code in this repo)

## Project Structure

- `client/` React frontend
- `server/` Backend dependencies (placeholder for future API server)

## Prerequisites

- Node.js (LTS recommended; includes npm)
- An ExchangeRate-API key from https://www.exchangerate-api.com/

## Installation

1. Clone the repository.
   ```bash
   git clone https://github.com/Purvesh-PJ/currency_conversion.git
   cd currency_conversion
   ```
2. Install client dependencies.
   ```bash
   cd client
   npm install
   ```
3. (Optional) Install server dependencies.
   ```bash
   cd ../server
   npm install
   ```

## Configuration

Update the API key used by the client:

- Open `client/src/services/currencyService.js`
- Replace the `BASE_URL` value with your key:
  `https://v6.exchangerate-api.com/v6/<YOUR_API_KEY>`

## Run Locally

```bash
cd client
npm start
```

The app runs at `http://localhost:3000`.

## Build

```bash
cd client
npm run build
```

## Tests

```bash
cd client
npm test
```

## Notes

- The frontend currently calls ExchangeRate-API directly; no backend server is
  required to run the app.
- The default Create React App README is in `client/README.md`.
