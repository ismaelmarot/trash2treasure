const sgMail = require('@sendgrid/mail');
const { render } = require('@react-email/render');
const { 
  VerificationEmail, 
  ForgotPasswordEmail, 
  ShareEmail,
  WeeklyReportEmail 
} = require('./templates/index');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const APP_EMAIL = process.env.APP_EMAIL || 'noreply@trash2treasure-app.vercel.app';

async function sendEmail(to, subject, htmlContent) {
  try {
    await sgMail.send({
      to,
      from: APP_EMAIL,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
}

async function sendVerificationEmail(to, name, code) {
  const html = await render(VerificationEmail({ name, code }));
  return sendEmail(to, 'Verificá tu email en Trash2Treasure', html);
}

async function sendForgotPasswordEmail(to, name, newPassword) {
  const html = await render(ForgotPasswordEmail({ name, newPassword }));
  return sendEmail(to, 'Recuperá tu cuenta de Trash2Treasure', html);
}

async function sendShareEmail(to, senderName) {
  const html = await render(ShareEmail({ senderName }));
  return sendEmail(to, '¡Te invitaron a Trash2Treasure!', html);
}

async function sendWeeklyReportEmail(to, name, data) {
  const html = await render(WeeklyReportEmail({ 
    name, 
    weeklyScore: data.weeklyScore, 
    prevWeeklyScore: data.prevWeeklyScore, 
    grade: data.grade, 
    totalReports: data.totalReports, 
    totalCollected: data.totalCollected,
    totalPoints: data.totalPoints 
  }));
  return sendEmail(to, '📊 Tu reporte semanal de Eco Impacto', html);
}

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendShareEmail,
  sendWeeklyReportEmail,
};