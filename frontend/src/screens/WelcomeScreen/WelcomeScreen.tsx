import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <Container>
      <Content>
        <LogoContainer>
          <LogoIcon>♻️</LogoIcon>
          <LogoText>Trash2Treasure</LogoText>
        </LogoContainer>
        
        <Title>Dale una segunda vida a lo que amas</Title>
        <Subtitle>
          La comunidad de economía circular más grande de tu zona. 
          Encuentra, comparte y salva tesoros.
        </Subtitle>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/register')}>
            Empezar ahora
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/login')}>
            Ya tengo cuenta
          </SecondaryButton>
        </ButtonGroup>

        <Footer>
          Al continuar, aceptas nuestros términos y condiciones.
        </Footer>
      </Content>
      <BackgroundDecoration />
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  padding: 24px;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  max-width: 480px;
  width: 100%;
  text-align: center;
  z-index: 10;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
`;

const LogoIcon = styled.div`
  font-size: 64px;
  margin-bottom: 12px;
`;

const LogoText = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #1d1d1f;
  letter-spacing: -0.5px;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 16px;
  line-height: 1.1;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #86868b;
  margin-bottom: 48px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const PrimaryButton = styled.button`
  background: #0071e3;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
    background: #0077ed;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SecondaryButton = styled.button`
  background: #f5f5f7;
  color: #0071e3;
  border: none;
  padding: 18px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #e8e8ed;
  }
`;

const Footer = styled.p`
  margin-top: 48px;
  font-size: 12px;
  color: #86868b;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0,113,227,0.05) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: 1;
`;
