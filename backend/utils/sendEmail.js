const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Freelancer Board" <${process.env.SMTP_FROM || 'noreply@freelancerboard.com'}>`,
        to,
        subject,
        text,
        html
      });
      console.log(`[Email Sent] To: ${to} | Subject: ${subject}`);
    } else {
      console.log(`[Mock Email Notification] To: ${to} | Subject: ${subject}`);
      console.log(`[Body]: ${text || html}`);
    }
  } catch (err) {
    console.error(`Failed to send email to ${to}: ${err.message}`);
  }
};

module.exports = sendEmail;
