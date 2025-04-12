import express from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

// Temporary storage for 2FA codes (use a database in production)
const twoFACodes = {};

// Check if credentials are available
if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials are missing in environment variables!');
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        type: 'login', // Explicitly set auth type
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false,
    }
});

// More detailed connection verification
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Configuration:', {
            host: 'smtp.gmail.com',
            port: 587,
            user: process.env.SMTP_USER ? process.env.SMTP_USER : 'NOT SET',
            passProvided: process.env.SMTP_PASS ? 'YES' : 'NO'
        });
        console.error('SMTP Verification Error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            command: error.command
        });
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Route to send 2FA code
router.post("/send-2fa-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    console.log('Attempting to send email to:', email);

    const code = crypto.randomInt(100000, 999999).toString();
    twoFACodes[email] = { code, expiresAt: Date.now() + 5 * 60 * 1000 };

    const mailOptions = {
      from: `"JJM Manufacturing" <${process.env.SMTP_USER}>`, // Use SMTP_USER instead of SMTP_FROM
      to: email,
      subject: "Your 2FA Verification Code",
      text: `Magandang Araw Ka-JJM, Ang iyong Verification Code ay ${code}`,
    };

    console.log('Mail options:', { ...mailOptions, pass: '[HIDDEN]' });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Full error object:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      error: "Failed to send verification code", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route to verify 2FA code
router.post("/verify-2fa-code", (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code are required" });
  }

  const storedCode = twoFACodes[email];

  if (!storedCode) {
    return res.status(400).json({ error: "No code found for this email" });
  }

  if (storedCode.expiresAt < Date.now()) {
    return res.status(400).json({ error: "Code has expired" });
  }

  if (storedCode.code !== code) {
    return res.status(400).json({ error: "Invalid code" });
  }

  // Code is valid, delete it from storage
  delete twoFACodes[email];

  res.status(200).json({ message: "2FA verification successful" });
});

export default router;
