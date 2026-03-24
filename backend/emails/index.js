const APP_ICON = 'https://trash2treasure-app.vercel.app/icon-192.png';
const APP_URL = 'https://trash2treasure-app.vercel.app';

const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; color: #1d1d1f; -webkit-font-smoothing: antialiased; }
  .container { max-width: 520px; margin: 0 auto; padding: 40px 20px; }
  .card { background: #ffffff; border-radius: 20px; padding: 48px 40px; box-shadow: 0 2px 20px rgba(0,0,0,0.06); }
  .icon { width: 72px; height: 72px; border-radius: 18px; margin: 0 auto 24px; display: block; }
  .title { font-size: 28px; font-weight: 700; color: #1d1d1f; text-align: center; margin-bottom: 8px; letter-spacing: -0.5px; }
  .subtitle { font-size: 17px; color: #86868b; text-align: center; margin-bottom: 32px; line-height: 1.5; }
  .code-box { background: #f5f5f7; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; }
  .code { font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #1d1d1f; font-family: 'SF Mono', 'Menlo', monospace; }
  .button { display: inline-block; background: #42a59f; color: #ffffff; padding: 16px 40px; border-radius: 980px; text-decoration: none; font-size: 17px; font-weight: 600; letter-spacing: 0.2px; }
  .button:hover { background: #3a9490; }
  .footer { text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5ea; }
  .footer p { font-size: 13px; color: #86868b; line-height: 1.6; }
  .highlight { color: #42a59f; font-weight: 600; }
  .info-box { background: #f5f5f7; border-radius: 16px; padding: 20px 24px; margin: 24px 0; }
  .info-label { font-size: 13px; color: #86868b; margin-bottom: 4px; }
  .info-value { font-size: 17px; font-weight: 600; color: #1d1d1f; font-family: 'SF Mono', 'Menlo', monospace; }
`;

function verificationEmail(name, code) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="card">
    <img src="${APP_ICON}" alt="Trash2Treasure" class="icon" />
    <h1 class="title">Verificá tu email</h1>
    <p class="subtitle">Hola ${name}, usá este código para verificar tu cuenta en Trash2Treasure.</p>
    <div class="code-box">
      <div class="code">${code}</div>
    </div>
    <p class="subtitle" style="font-size: 14px; margin-bottom: 0;">Este código expira en 10 minutos.</p>
    <div class="footer">
      <p>Trash2Treasure &middot; Cuidemos el planeta juntos</p>
      <p><a href="${APP_URL}" style="color: #42a59f; text-decoration: none;">trash2treasure-app.vercel.app</a></p>
    </div>
  </div>
</div>
</body></html>`;
}

function forgotPasswordEmail(name, newPassword) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="card">
    <img src="${APP_ICON}" alt="Trash2Treasure" class="icon" />
    <h1 class="title">Recuperá tu cuenta</h1>
    <p class="subtitle">Hola ${name}, acá están tus datos de acceso temporales.</p>
    <div class="info-box">
      <div class="info-label">Email</div>
      <div class="info-value" style="font-family: -apple-system, sans-serif;">${name}</div>
    </div>
    <div class="info-box">
      <div class="info-label">Contraseña temporal</div>
      <div class="info-value">${newPassword}</div>
    </div>
    <p class="subtitle" style="font-size: 14px;">Te recomendamos cambiar tu contraseña una vez que ingresés.</p>
    <div style="text-align: center; margin-top: 24px;">
      <a href="${APP_URL}" class="button">Abrir Trash2Treasure</a>
    </div>
    <div class="footer">
      <p>Trash2Treasure &middot; Cuidemos el planeta juntos</p>
      <p><a href="${APP_URL}" style="color: #42a59f; text-decoration: none;">trash2treasure-app.vercel.app</a></p>
    </div>
  </div>
</div>
</body></html>`;
}

function shareEmail(senderName) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="card">
    <img src="${APP_ICON}" alt="Trash2Treasure" class="icon" />
    <h1 class="title">Trash2Treasure</h1>
    <p class="subtitle">Reportá, reciclá y sumá Eco Points</p>
    <p class="subtitle" style="margin-bottom: 32px;"><strong class="highlight">${senderName}</strong> te invita a unirte a Trash2Treasure, la app para reportar y reciclar residuos en tu zona.</p>
    <div style="text-align: center;">
      <a href="${APP_URL}" class="button">Descargar ahora</a>
    </div>
    <div class="footer">
      <p>Trash2Treasure &middot; Cuidemos el planeta juntos</p>
      <p><a href="${APP_URL}" style="color: #42a59f; text-decoration: none;">trash2treasure-app.vercel.app</a></p>
    </div>
  </div>
</div>
</body></html>`;
}

module.exports = { verificationEmail, forgotPasswordEmail, shareEmail };
