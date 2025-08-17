import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CurrencyConverter from '../components/CurrencyConverter';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  font-family: 'Arial', sans-serif;
`;

const Heading = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Subheading = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const Button = styled(Link)`
  padding: 10px 20px;
  font-size: 1.2rem;
  text-decoration: none;
  color: #ffffff;
  background-color: #ff6b6b;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;

  &:hover {
    background-color: #d64545;
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 20px;
  font-size: 0.9rem;
  color: #dcdcdc;
`;


const HomePage = () => {
  return (
    <Container>
      <Heading>Real-Time Currency Converter</Heading>
      <Subheading>Convert currencies easily with real-time exchange rates Our Currency Converter allows you to instantly convert currencies with up-to-date exchange rates.</Subheading>
      <CurrencyConverter />
      <Footer>© 2024 Currency Converter. All rights reserved.</Footer>
    </Container>
  );
};

export default HomePage;

