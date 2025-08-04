const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/notify', async (req, res) => {
  const { email, subject, message } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: message
    });
    res.json({ status: 'Email sent' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = app;