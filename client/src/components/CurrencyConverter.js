import { useState } from 'react';
import styled from 'styled-components';
import { getExchangeRate } from '../services/currencyService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.25rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  width: 100%;
  max-width: 320px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const Heading = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.2rem;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px 12px;
  font-size: 0.9rem;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    outline: none;
    border-color: #764ba2;
    background: white;
    box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  font-size: 0.9rem;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  background: #fafafa;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:focus {
    outline: none;
    border-color: #764ba2;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
  }
`;

const SwapIcon = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.25rem 0;
  color: #764ba2;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(118, 75, 162, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Result = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  text-align: center;
  color: white;
`;

const ResultLabel = styled.div`
  font-size: 0.7rem;
  opacity: 0.9;
  margin-bottom: 0.3rem;
`;

const ResultValue = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
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
  { code: 'PKR', name: 'Pakistani Rupee' },
  { code: 'BDT', name: 'Bangladeshi Taka' },
  { code: 'LKR', name: 'Sri Lankan Rupee' },
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

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  return (
    <Container>
      <Card>
        <Heading>💱 Convert Currency</Heading>
        <Form onSubmit={handleConvert}>
          <InputGroup>
            <InputWrapper>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <Label>From</Label>
              <Select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {supportedCurrencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </Select>
            </InputWrapper>
            <SwapIcon onClick={handleSwap} style={{ cursor: 'pointer' }}>
              ⇅
            </SwapIcon>
            <InputWrapper>
              <Label>To</Label>
              <Select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {supportedCurrencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </Select>
            </InputWrapper>
          </InputGroup>
          <Button type="submit">Convert</Button>
        </Form>
        {convertedAmount && (
          <Result>
            <ResultLabel>Converted Amount</ResultLabel>
            <ResultValue>{amount} {fromCurrency} = {convertedAmount} {toCurrency}</ResultValue>
          </Result>
        )}
      </Card>
    </Container>
  );
};

export default CurrencyConverter;
