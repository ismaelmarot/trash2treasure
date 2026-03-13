import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/api';

export function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(validations).every(v => v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos de seguridad');
      return;
    }
    setError('');

    try {

      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/verify', { state: { email } });
      } else {

        setError(data.error || 'Registration failed');
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
        <Title>Crear cuenta</Title>
        <Subtitle>Únete a la comunidad de Trash2Treasure</Subtitle>

        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Nombre</Label>
            <Input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Tu nombre completo"
              required 
            />
          </InputGroup>

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
                placeholder="Mínimo 8 caracteres"
                required 
              />
              <ToggleButton 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🫣' : '👁️'}
              </ToggleButton>
            </PasswordWrapper>
            
            <ValidationList>
              <ValidationItem $valid={validations.length}>
                {validations.length ? '✅' : '○'} Mínimo 8 caracteres
              </ValidationItem>
              <ValidationItem $valid={validations.uppercase}>
                {validations.uppercase ? '✅' : '○'} Una mayúscula
              </ValidationItem>
              <ValidationItem $valid={validations.lowercase}>
                {validations.lowercase ? '✅' : '○'} Una minúscula
              </ValidationItem>
              <ValidationItem $valid={validations.number}>
                {validations.number ? '✅' : '○'} Un número
              </ValidationItem>
            </ValidationList>
          </InputGroup>


          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit">Registrarse</SubmitButton>
        </Form>

        <FooterText>
          ¿Ya tienes cuenta? <StyledLink to="/login">Inicia sesión</StyledLink>
        </FooterText>
      </Card>
    </Container>
  );
}

// Reusing styles from LoginScreen (would ideally be in shared components)
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
`;

const ValidationList = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const ValidationItem = styled.div<{ $valid: boolean }>`
  font-size: 11px;
  color: ${props => props.$valid ? '#28a745' : '#86868b'};
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease;
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

const FooterText = styled.p`
  font-size: 14px;
  color: #86868b;
  margin-top: 24px;
`;

const StyledLink = styled(Link)`
  color: #0071e3;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;
