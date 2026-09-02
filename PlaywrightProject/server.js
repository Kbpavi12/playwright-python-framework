require('dotenv').config();
const express = require('express');
const { createTransport } = require('nodemailer');
const { join } = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/submit', async (req, res) => {
  try {
    const { fullName, email, phone, dob, program, country } = req.body || {};

    if (!fullName || !email || !phone || !dob || !program) {
      return res.status(400).json({ ok: false, message: 'Missing required fields.' });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const transporter = smtpHost && smtpUser && smtpPass
      ? createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT || 587) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        })
      : createTransport({
          streamTransport: true,
          newline: 'unix',
          buffer: true,
        });

    const body = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `DOB: ${dob}`,
      `Program: ${program}`,
      `Country: ${country || 'Not provided'}`,
    ].join('\n');

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.TO_EMAIL || 'k.b.pavithra@capgemini.com',
      subject: 'Admission Form Submission',
      text: body,
      html: `<pre>${body.replace(/\n/g, '<br>')}</pre>`,
    });

    return res.json({
      ok: true,
      message: 'Email sent successfully.',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Mail send failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'Mail failed to send.',
      error: error && error.message ? error.message : String(error),
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'admission-form.html'));
});

app.listen(port, () => {
  console.log(`Admission form server running at http://localhost:${port}`);
});
