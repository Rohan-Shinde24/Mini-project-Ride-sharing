const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  // Support both naming conventions
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT || 587;
  const from = process.env.SMTP_FROM || user;

  // Check if credentials are set
  if (!user || !pass) {
    console.log('---------------------------------------------------');
    console.log('WARNING: Email credentials missing in .env file.');
    console.log('Printing email to console instead of sending.');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('---------------------------------------------------');
    return true; // Return true so the app doesn't crash
  }

  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: user,
        pass: pass
      }
    });

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: text.replace(/\n/g, '<br>') // Convert newlines to HTML breaks for basic formatting
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    
    // Fallback: Print email to console so user isn't blocked
    console.log('---------------------------------------------------');
    console.log('FALLBACK: Email failed to send. Printing to console:');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log('---------------------------------------------------');

    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your EMAIL_USER/SMTP_USER and EMAIL_PASS/SMTP_PASS.');
      console.error('If using Gmail, ensure you are using an App Password, not your login password.');
    }
    return false;
  }
};

module.exports = sendEmail;
