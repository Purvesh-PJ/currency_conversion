import styled from 'styled-components';
import CurrencyConverter from '../components/CurrencyConverter';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    font-size: 1.8rem;
  }
`;



const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
  
  @media (min-width: 992px) {
    flex-direction: row;
    gap: 4rem;
    padding: 2rem 4rem;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  max-width: 700px;
  margin-bottom: 1rem;
  
  @media (min-width: 992px) {
    text-align: left;
    flex: 1;
    margin-bottom: 0;
  }
`;

const Heading = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: white;
  margin: 0 0 1rem 0;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
`;

const Subheading = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
`;

const Features = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
  
  @media (min-width: 992px) {
    justify-content: flex-start;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 1);
  font-size: 0.95rem;
  
  span {
    font-size: 2rem;
  }
`;

const ConverterWrapper = styled.div`
  width: 100%;
  max-width: 450px;
  
  @media (min-width: 992px) {
    flex-shrink: 0;
  }
`;

const Footer = styled.footer`
  padding: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const HomePage = () => {
  return (
    <Container>
      <Header>
        <Logo>
          <span>💱</span> CurrencyX
        </Logo>
      </Header>
      
      <Main>
        <HeroSection>
          <Heading>Real-Time Currency Converter</Heading>
          <Subheading>
            Convert currencies instantly with live exchange rates. 
            Fast, accurate, and easy to use.
          </Subheading>
          <Features>
            <FeatureItem><span>⚡</span> Real-time rates</FeatureItem>
            <FeatureItem><span>🌍</span> 90+ currencies</FeatureItem>
            <FeatureItem><span>🔒</span> Secure & reliable</FeatureItem>
          </Features>
        </HeroSection>
        
        <ConverterWrapper>
          <CurrencyConverter />
        </ConverterWrapper>
      </Main>
      
      <Footer>
        © 2025 CurrencyX. All rights reserved.
      </Footer>
    </Container>
  );
};

export default HomePage;
