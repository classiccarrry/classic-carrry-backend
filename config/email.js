import pkg from 'nodemailer';
const { createTransport } = pkg;

// Create reusable transporter
const createTransporter = () => {
  // Use SendGrid (works on all hosting platforms)
  if (process.env.SENDGRID_API_KEY) {
    console.log('📬 Using SendGrid for email');
    return createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Fallback to Gmail (local development only)
  console.log('📬 Using Gmail for email');
  return createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    throw error;
  }
};

export default { sendEmail };
