import axios from 'axios';

// Replace 'YOUR_API_KEY' with your actual API key
const BASE_URL = 'https://v6.exchangerate-api.com/v6/f1e21331a568057f0485efc7';

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

