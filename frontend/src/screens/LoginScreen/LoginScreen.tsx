import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../constants'
import { useAuth } from '../../hooks/useAuth'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)
        navigate('/');
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate('/welcome')}>
            ← Volver
          </BackButton>
        </Header>
        <Title>Bienvenido de nuevo</Title>
        <Subtitle>Ingresa a tu cuenta de Trash2Treasure</Subtitle>

        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com"
              required 
            />
          </InputGroup>
          
          <InputGroup>
            <Label>Contraseña</Label>
            <PasswordWrapper>
              <Input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="********"
                required 
              />
              <ToggleButton 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? '🫣' : '👁️'}
              </ToggleButton>
            </PasswordWrapper>
          </InputGroup>


          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
        </Form>

        <Divider><span>O continúa con</span></Divider>

        <SocialButtons>
          <SocialButton $provider="facebook">Facebook</SocialButton>
          <SocialButton $provider="apple">Apple</SocialButton>
        </SocialButtons>

        <FooterText>
          ¿No tienes cuenta? <StyledLink to="/register">Regístrate</StyledLink>
        </FooterText>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-color, #f5f5f7);
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #0071e3;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    text-decoration: underline;
  }
`;


const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1d1d1f;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #86868b;
  margin-bottom: 32px;
`;

const Form = styled.form`
  text-align: left;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #d2d2d7;
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #86868b;
  
  &:hover {
    color: #1d1d1f;
  }
`;


const ErrorMessage = styled.p`
  color: #ff3b30;
  font-size: 12px;
  margin-top: -12px;
  margin-bottom: 16px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: #0071e3;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #0077ed;
  }
`;

const Divider = styled.div`
  margin: 24px 0;
  position: relative;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #d2d2d7;
  }
  
  span {
    position: relative;
    background: white;
    padding: 0 12px;
    font-size: 12px;
    color: #86868b;
  }
`;

const SocialButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`;

const SocialButton = styled.button<{ $provider: 'facebook' | 'apple' }>`
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #d2d2d7;
  background: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f7;
  }
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #86868b;
`;

const StyledLink = styled(Link)`
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;
