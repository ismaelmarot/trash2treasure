import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../constants/api';

export function VerificationScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login', { state: { message: 'Cuenta verificada. ¡Ya puedes entrar!' } });
      } else {
        setError(data.error || 'Código inválido');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Icon>📧</Icon>
        <Title>Verifica tu email</Title>
        <Subtitle>
          Hemos enviado un código de 6 dígitos a <br />
          <strong>{email}</strong>
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Código de verificación</Label>
            <CodeInput 
              type="text" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="000000"
              maxLength={6}
              required 
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Verificar Cuenta'}
          </SubmitButton>
        </Form>
        
        <ResendLinkText>
          ¿No recibiste nada? <button type="button">Reenviar código</button>
        </ResendLinkText>
      </Card>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f7;
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #86868b;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const Form = styled.form`
  text-align: left;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
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

const CodeInput = styled.input`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #d2d2d7;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 8px;
  
  &:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }
`;

const ErrorMessage = styled.p`
  color: #ff3b30;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: #0071e3;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:disabled {
    background: #d2d2d7;
  }
`;

const ResendLinkText = styled.p`
  margin-top: 24px;
  font-size: 14px;
  color: #86868b;
  
  button {
    background: none;
    border: none;
    color: #0071e3;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;
