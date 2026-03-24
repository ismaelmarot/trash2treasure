import { Html, Head, Preview, Body, Container, Section, Text, Button, Hr, Img, Link } from '@react-email/components';
import * as React from 'react';

const APP_ICON = 'https://trash2treasure-app.vercel.app/icon-192.png';
const APP_URL = 'https://trash2treasure-app.vercel.app';

const styles = {
  container: {
    backgroundColor: '#f5f5f7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    padding: '40px 0',
    WebkitFontSmoothing: 'antialiased',
  } as React.CSSProperties,
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '48px 40px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    maxWidth: '520px',
    margin: '0 auto',
  } as React.CSSProperties,
  logo: {
    width: '72px',
    height: '72px',
    borderRadius: '18px',
    display: 'block',
    margin: '0 auto 24px',
  } as React.CSSProperties,
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1d1d1f',
    textAlign: 'center' as const,
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '17px',
    color: '#86868b',
    textAlign: 'center' as const,
    marginBottom: '32px',
    lineHeight: 1.5,
  } as React.CSSProperties,
  codeBox: {
    backgroundColor: '#f5f5f7',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center' as const,
    margin: '24px 0',
  } as React.CSSProperties,
  code: {
    fontSize: '42px',
    fontWeight: 700,
    letterSpacing: '12px',
    color: '#1d1d1f',
    fontFamily: '"SF Mono", "Menlo", monospace',
  } as React.CSSProperties,
  button: {
    backgroundColor: '#42a59f',
    color: '#ffffff',
    padding: '16px 40px',
    borderRadius: '980px',
    textDecoration: 'none',
    fontSize: '17px',
    fontWeight: 600,
    letterSpacing: '0.2px',
    display: 'inline-block',
  } as React.CSSProperties,
  footer: {
    textAlign: 'center' as const,
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e5ea',
  } as React.CSSProperties,
  footerText: {
    fontSize: '13px',
    color: '#86868b',
    lineHeight: 1.6,
  } as React.CSSProperties,
  highlight: {
    color: '#42a59f',
    fontWeight: 600,
  } as React.CSSProperties,
  infoBox: {
    backgroundColor: '#f5f5f7',
    borderRadius: '16px',
    padding: '20px 24px',
    margin: '24px 0',
  } as React.CSSProperties,
  infoLabel: {
    fontSize: '13px',
    color: '#86868b',
    marginBottom: '4px',
  } as React.CSSProperties,
  infoValue: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#1d1d1f',
    fontFamily: '"SF Mono", "Menlo", monospace',
  } as React.CSSProperties,
};

export function VerificationEmail({ name, code }: { name: string; code: string }) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Verificá tu email en Trash2Treasure</Preview>
      <Body style={styles.container}>
        <Container style={styles.card}>
          <Img src={APP_ICON} alt="Trash2Treasure" style={styles.logo} />
          <Text style={styles.title}>Verificá tu email</Text>
          <Text style={styles.subtitle}>
            Hola {name}, usá este código para verificar tu cuenta en Trash2Treasure.
          </Text>
          <Section style={styles.codeBox}>
            <Text style={styles.code}>{code}</Text>
          </Section>
          <Text style={{ ...styles.subtitle, fontSize: '14px', marginBottom: 0 }}>
            Este código expira en 10 minutos.
          </Text>
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Trash2Treasure · Cuidemos el planeta juntos
            </Text>
            <Link href={APP_URL} style={{ color: '#42a59f', textDecoration: 'none' }}>
              trash2treasure-app.vercel.app
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function ForgotPasswordEmail({ name, newPassword }: { name: string; newPassword: string }) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Recuperá tu cuenta de Trash2Treasure</Preview>
      <Body style={styles.container}>
        <Container style={styles.card}>
          <Img src={APP_ICON} alt="Trash2Treasure" style={styles.logo} />
          <Text style={styles.title}>Recuperá tu cuenta</Text>
          <Text style={styles.subtitle}>
            Hola {name}, acá están tus datos de acceso temporales.
          </Text>
          <Section style={styles.infoBox}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={{ ...styles.infoValue, fontFamily: '-apple-system, sans-serif' }}>{name}</Text>
          </Section>
          <Section style={styles.infoBox}>
            <Text style={styles.infoLabel}>Contraseña temporal</Text>
            <Text style={styles.infoValue}>{newPassword}</Text>
          </Section>
          <Text style={{ ...styles.subtitle, fontSize: '14px' }}>
            Te recomendamos cambiar tu contraseña una vez que ingresés.
          </Text>
          <Section style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button href={APP_URL} style={styles.button}>
              Abrir Trash2Treasure
            </Button>
          </Section>
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Trash2Treasure · Cuidemos el planeta juntos
            </Text>
            <Link href={APP_URL} style={{ color: '#42a59f', textDecoration: 'none' }}>
              trash2treasure-app.vercel.app
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function ShareEmail({ senderName }: { senderName: string }) {
  return (
    <Html lang="es">
      <Head />
      <Preview>¡Invitación a Trash2Treasure!</Preview>
      <Body style={styles.container}>
        <Container style={styles.card}>
          <Img src={APP_ICON} alt="Trash2Treasure" style={styles.logo} />
          <Text style={styles.title}>Trash2Treasure</Text>
          <Text style={styles.subtitle}>Reportá, reciclá y sumá Eco Points</Text>
          <Text style={{ ...styles.subtitle, marginBottom: '32px' }}>
            <span style={styles.highlight}>{senderName}</span> te invita a unirte a Trash2Treasure, la app para reportar y reciclar residuos en tu zona.
          </Text>
          <Section style={{ textAlign: 'center' }}>
            <Button href={APP_URL} style={styles.button}>
              Descargar ahora
            </Button>
          </Section>
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Trash2Treasure · Cuidemos el planeta juntos
            </Text>
            <Link href={APP_URL} style={{ color: '#42a59f', textDecoration: 'none' }}>
              trash2treasure-app.vercel.app
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function WeeklyReportEmail({ 
  name, 
  weeklyScore, 
  prevWeeklyScore, 
  grade, 
  totalReports, 
  totalCollected,
  totalPoints 
}: { 
  name: string; 
  weeklyScore: number; 
  prevWeeklyScore: number; 
  grade: string; 
  totalReports: number;
  totalCollected: number;
  totalPoints: number;
}) {
  const scoreChange = weeklyScore - prevWeeklyScore;
  const trend = scoreChange > 0 ? '↑' : scoreChange < 0 ? '↓' : '→';
  
  const gradeColors: Record<string, string> = {
    'A+++': '#27ae60',
    'A++': '#2ecc71',
    'A+': '#58d68d',
    'A': '#82e0aa',
    'B': '#f9e79f',
    'C': '#f5b041',
    'D': '#eb984e',
    'E': '#e74c3c',
    'F': '#c0392b',
    'G': '#922b21',
  };
  
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    marginTop: '24px',
  } as React.CSSProperties;
  
  const statBox = {
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center' as const,
  } as React.CSSProperties;
  
  const statValue = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1d1d1f',
  } as React.CSSProperties;
  
  const statLabel = {
    fontSize: '13px',
    color: '#86868b',
    marginTop: '4px',
  } as React.CSSProperties;

  return (
    <Html lang="es">
      <Head />
      <Preview>Tu reporte semanal de Eco Impacto</Preview>
      <Body style={styles.container}>
        <Container style={styles.card}>
          <Img src={APP_ICON} alt="Trash2Treasure" style={styles.logo} />
          <Text style={styles.title}>📊 Tu Eco Impacto Semanal</Text>
          <Text style={styles.subtitle}>
            Hola {name}, acá está el resumen de tu actividad esta semana en Trash2Treasure.
          </Text>
          
          <Section style={{ 
            backgroundColor: gradeColors[grade] || '#42a59f', 
            borderRadius: '16px', 
            padding: '24px',
            textAlign: 'center' as const,
          }}>
            <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Tu calificación semanal</Text>
            <Text style={{ color: '#fff', fontSize: '64px', fontWeight: 700, margin: 0, lineHeight: 1 }}>{grade}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginTop: '8px' }}>
              {weeklyScore} pts esta semana
            </Text>
            <Text style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginTop: '12px' }}>
              {trend} {scoreChange > 0 ? `+${scoreChange}` : scoreChange} pts vs semana anterior
            </Text>
          </Section>
          
          <Section style={cardStyle}>
            <Text style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '16px', textAlign: 'center' as const }}>
              📈 Estadísticas de la semana
            </Text>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ ...statBox, flex: 1 }}>
                <div style={statValue}>{totalReports}</div>
                <div style={statLabel}>Reportes</div>
              </div>
              <div style={{ ...statBox, flex: 1 }}>
                <div style={statValue}>{totalCollected}</div>
                <div style={statLabel}>Recolectados</div>
              </div>
              <div style={{ ...statBox, flex: 1 }}>
                <div style={statValue}>{totalPoints}</div>
                <div style={statLabel}>Pts Totales</div>
              </div>
            </div>
          </Section>
          
          <Section style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button href={APP_URL} style={styles.button}>
              Ver detalles en la app
            </Button>
          </Section>
          
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              ¡Seguí así! Cada reporte cuenta para cuidar nuestro planeta 🌍
            </Text>
            <Text style={{ ...styles.footerText, marginTop: '8px' }}>
              Trash2Treasure · Cuidemos el planeta juntos
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}