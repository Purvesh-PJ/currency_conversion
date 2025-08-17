import React, { useState } from 'react';
import styled from 'styled-components';
import { getExchangeRate } from '../services/currencyService'; // Import the service

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
`;

const Card = styled.div`
  background: #fff;
  padding: 3rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #4caf50;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
`;

const Select = styled.select`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
`;

const Button = styled.button`
  padding: 12px;
  font-size: 1rem;
  color: white;
  background-color: #4caf50;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const Result = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 1.5rem;
  color: #333;
`;

const supportedCurrencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'AED', name: 'United Arab Emirates Dirham' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },
    { code: 'OMR', name: 'Omani Rial' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'BHD', name: 'Bahraini Dinar' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'VND', name: 'Vietnamese Dong' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'JOD', name: 'Jordanian Dinar' },
    { code: 'QAR', name: 'Qatari Rial' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'PEN', name: 'Peruvian Nuevo Sol' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'UYU', name: 'Uruguayan Peso' },
    { code: 'AED', name: 'United Arab Emirates Dirham' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'ISK', name: 'Icelandic Króna' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'HRK', name: 'Croatian Kuna' },
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'BMD', name: 'Bermudian Dollar' },
    { code: 'MDL', name: 'Moldovan Leu' },
    { code: 'LTL', name: 'Lithuanian Litas' },
    { code: 'LVL', name: 'Latvian Lats' },
    { code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'AMD', name: 'Armenian Dram' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'SYP', name: 'Syrian Pound' },
    { code: 'SDG', name: 'Sudanese Pound' },
    { code: 'NPR', name: 'Nepalese Rupee' },
    { code: 'MWK', name: 'Malawian Kwacha' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'MDL', name: 'Moldovan Leu' },
    { code: 'TJS', name: 'Tajikistani Somoni' },
    { code: 'KGS', name: 'Kyrgyzstani Som' },
    { code: 'UZS', name: 'Uzbekistani Som' },
    { code: 'MNT', name: 'Mongolian Tugrik' },
    { code: 'LAK', name: 'Laotian Kip' },
    { code: 'MMK', name: 'Myanmar Kyat' },
    { code: 'NIO', name: 'Nicaraguan Córdoba' },
    { code: 'CUP', name: 'Cuban Peso' },
    { code: 'HNL', name: 'Honduran Lempira' },
    { code: 'CRC', name: 'Costa Rican Colón' },
    { code: 'PYG', name: 'Paraguayan Guarani' },
    { code: 'VEF', name: 'Venezuelan Bolívar' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'XOF', name: 'West African CFA Franc' },
    { code: 'MRU', name: 'Mauritanian Ouguiya' },
    { code: 'DJF', name: 'Djiboutian Franc' },
    { code: 'TND', name: 'Tunisian Dinar' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'SLL', name: 'Sierra Leonean Leone' },
    { code: 'AFN', name: 'Afghan Afghani' },
    { code: 'BTN', name: 'Bhutanese Ngultrum' },
    { code: 'GEL', name: 'Georgian Lari' },
    { code: 'KMF', name: 'Comorian Franc' },
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'XOF', name: 'West African CFA Franc' },
    { code: 'SHP', name: 'Saint Helena Pound' },
    { code: 'STN', name: 'São Tomé and Príncipe Dobra' }
];
  
  
const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);

  const handleConvert = async (e) => {
    e.preventDefault();
    try {
      const rate = await getExchangeRate(fromCurrency, toCurrency);
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container>
      <Card>
        <Heading>Currency Converter</Heading>
            <Form onSubmit={handleConvert}>
                <InputGroup>
                    <Input
                    type="number"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    />
                    <Select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                    {supportedCurrencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                        </option>
                    ))}
                    </Select>
                    <Select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                    {supportedCurrencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                        </option>
                    ))}
                    </Select>
                </InputGroup>
            <Button type="submit">Convert</Button>
        </Form>
        {convertedAmount && (
          <Result>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </Result>
        )}
      </Card>
    </Container>
  );
};

export default CurrencyConverter;

