const transporter = require('../config/emailConfig');

const enviarEmail = async (para, assunto, texto) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: para,
      subject: assunto,
      text: texto
    });
    console.log('E-mail enviado:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};

module.exports = enviarEmail;
