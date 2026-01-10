# 💱 CurrencyX

A modern, real-time currency converter built with React. Convert between 30+ currencies instantly with live exchange rates.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled_Components-6.1-DB7093?logo=styled-components&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## 📸 Preview

![CurrencyX Preview](./client/public/screenshots/Screenshot%202026-01-10%20171644.png)

## ✨ Features

- 🔄 Real-time exchange rates via ExchangeRate-API
- 🌍 Support for 30+ world currencies
- 🔀 Quick swap between source and target currencies
- 📱 Fully responsive design (mobile & desktop)
- 🎨 Modern glassmorphism UI with gradient accents

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Routing | React Router v7 |
| Styling | Styled Components |
| HTTP Client | Axios |
| Build Tool | Create React App |

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn
- [ExchangeRate-API](https://www.exchangerate-api.com/) key (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/Purvesh-PJ/currency_conversion.git
cd currency_conversion

# Install dependencies
cd client
npm install

# Start development server
npm start
```

App runs at `http://localhost:3000`

### Configuration

Add your API key in `client/src/services/currencyService.js`:

```javascript
const BASE_URL = 'https://v6.exchangerate-api.com/v6/YOUR_API_KEY';
```

## 📁 Project Structure

```
currency_conversion/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── CurrencyConverter.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   └── 404NotFound.js
│   │   ├── services/
│   │   │   └── currencyService.js
│   │   ├── AppRoutes.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by [Purvesh-PJ](https://github.com/Purvesh-PJ)
